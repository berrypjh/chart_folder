import dotenv from 'dotenv';
import OpenAI from 'openai';
import { spawnSync, execSync } from 'node:child_process';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

type CommitMessage = {
  title: string;
  body: string;
};

const root = import.meta.dirname;

dotenv.config({
  path: path.resolve(root, '../../.env'),
  override: true,
});

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

if (!apiKey) {
  console.error('[ai-commit] OPENAI_API_KEY가 설정되지 않았습니다. 루트 .env를 확인하세요.');
  process.exit(1);
}

const client = new OpenAI({ apiKey });

const getStagedFiles = (): string[] => {
  let output = '';
  try {
    output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
  } catch (e) {
    console.error('[ai-commit] git diff --cached --name-only 실행에 실패했습니다.');
    process.exit(1);
  }

  const files = output
    .split(/\r?\n/)
    .map((f) => f.trim())
    .filter(Boolean);

  if (files.length === 0) {
    console.error(
      '[ai-commit] 스테이징된 변경 파일을 찾을 수 없습니다. 먼저 `git add`로 변경을 올려주세요.',
    );
    process.exit(1);
  }

  return files;
};

const groupFilesByScope = (files: string[]): Record<string, string[]> => {
  const groups: Record<string, string[]> = {};

  for (const file of files) {
    const [first, second] = file.split('/');

    let scope = 'root';
    if ((first === 'apps' || first === 'libs') && second) {
      scope = second;
    }

    if (!groups[scope]) {
      groups[scope] = [];
    }
    groups[scope].push(file);
  }

  return groups;
};

const getScopedDiff = (files: string[]): string => {
  const result = spawnSync('git', ['diff', '--cached', '--', ...files], {
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    console.error('[ai-commit] git diff --cached -- <files> 실행에 실패했습니다.');
    process.exit(1);
  }

  const diff = (result.stdout as string) ?? '';

  if (!diff.trim()) {
    console.error('[ai-commit] 해당 scope에 대한 스테이징된 변경이 없습니다.');
    process.exit(1);
  }

  return diff;
};

const generateCommitMessageForScope = async (
  scope: string,
  diff: string,
  scopedFiles: string[],
): Promise<CommitMessage> => {
  console.log(`[ai-commit] scope "${scope}" 에 대한 커밋 제목과 상세 설명을 생성 중입니다...\n`);

  const instructions = [
    '너는 Git 커밋 메시지를 작성하는 도우미야.',
    'Conventional Commits 형식을 사용해서 제목과 본문을 만들어줘.',
    '',
    '요구사항:',
    '- title: 한 줄짜리 커밋 제목.',
    `  - 예: 'feat(${scope}): PWA 오프라인 캐시 기능 추가'`,
    '  - 타입(feat, fix, refactor, style, docs, chore 등)은 영어 그대로 사용.',
    '  - 나머지 설명은 모두 한국어로 작성.',
    `- 제목은 반드시 \`타입(${scope}): 설명\` 형식으로 작성해.`,
    `- scope는 반드시 "${scope}" 로만 사용해. 다른 scope 값은 사용하지 마.`,
    '- body: 커밋 상세 설명 (최대 3줄까지 가능).',
    '  - 무엇을, 왜, 어떻게 변경했는지 한국어로 간단하고 명확하게.',
    '  - 불릿 리스트(-)나 짧은 문장 최대 3줄로 요약해서 작성해도 좋음.',
    '',
    '반드시 아래 JSON 형식으로만 출력해:',
    '{',
    `  "title": "feat(${scope}): ~~",`,
    '  "body": "- ~~\\n- ~~"',
    '}',
    '',
    '추가 텍스트 없이 JSON만 반환해.',
  ].join('\n');

  const filesList = scopedFiles.map((f) => `- ${f}`).join('\n');

  const response = await client.responses.create({
    model,
    instructions,
    input: [
      {
        role: 'user',
        content: [
          `scope "${scope}" 에 해당하는 변경에 대해 한국어로 커밋 제목과 상세 설명을 만들어줘.`,
          '',
          '변경된 파일 목록:',
          filesList,
          '',
          'Git diff:',
          diff,
        ].join('\n'),
      },
    ],
    max_output_tokens: 256,
  });

  const raw = response.output_text?.trim();
  if (!raw) {
    throw new Error('모델이 응답을 생성하지 못했습니다.');
  }

  let title = '';
  let body = '';

  try {
    const parsed = JSON.parse(raw) as { title?: string; body?: string };
    title = (parsed.title ?? '').trim();
    body = (parsed.body ?? '').trim();
  } catch (e) {
    // JSON 파싱 실패 시: 첫 줄을 제목, 나머지를 본문으로 간주
    const lines = raw.split(/\r?\n/);
    title = (lines[0] ?? '').trim();
    body = lines.slice(1).join('\n').trim();
  }

  if (!title) {
    throw new Error('커밋 제목(title)을 생성하지 못했습니다.');
  }

  return { title, body };
};

const editCommitMessageWithEditor = (message: CommitMessage): CommitMessage | null => {
  const tmpDir = os.tmpdir();
  const tmpFile = path.join(tmpDir, `ai-commit-${Date.now()}.txt`);

  const initialContent =
    message.body && message.body.trim().length > 0
      ? `${message.title}\n\n${message.body}\n`
      : `${message.title}\n\n`;

  fs.writeFileSync(tmpFile, initialContent, 'utf8');

  let editor: string;
  if (process.platform === 'win32') {
    editor = 'notepad';
  } else {
    editor = process.env.GIT_EDITOR || process.env.EDITOR || 'vi';
  }

  console.log(`\n[ai-commit] ${editor} 에서 커밋 메시지를 편집하세요.`);
  console.log('[ai-commit] 에디터를 닫으면 다음 단계로 진행합니다.\n');

  const result = spawnSync(editor, [tmpFile], {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    console.error(`\n[ai-commit] 에디터가 비정상 종료되었습니다. (exit code: ${result.status})`);
    return null;
  }

  const edited = fs.readFileSync(tmpFile, 'utf8');
  fs.unlinkSync(tmpFile);

  const normalized = edited.replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');

  const title = (lines[0] ?? '').trim();
  const body = lines.slice(1).join('\n').trim();

  if (!title) {
    console.error('[ai-commit] 에디터에서 커밋 제목을 찾을 수 없습니다.');
    return null;
  }

  return { title, body };
};

const askUserForDecision = async (
  scope: string,
  message: CommitMessage,
): Promise<CommitMessage | null> => {
  console.log(`\n[ai-commit] scope "${scope}" 에 대한 제안된 커밋 메시지:`);
  console.log(`\n${message.title}\n`);
  if (message.body) {
    console.log(message.body);
    console.log('');
  }

  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(
    '이대로 커밋할까요? (y = 예, e = 제목/본문 수정, n = 전체 취소) ',
  );

  const lower = answer.trim().toLowerCase();

  if (lower === 'n') {
    rl.close();
    console.log('[ai-commit] 전체 커밋을 취소했습니다.');
    return null;
  }

  if (lower === 'e') {
    rl.close();

    const edited = editCommitMessageWithEditor(message);
    if (!edited) {
      console.log('[ai-commit] 커밋 메시지 수정을 취소했습니다.');
      return null;
    }

    return edited;
  }

  rl.close();
  return message;
};

const runGitCommitForScope = (scope: string, message: CommitMessage, files: string[]) => {
  const args = ['commit', '-m', message.title];

  if (message.body && message.body.trim().length > 0) {
    // git commit -m "title" -m "body"
    args.push('-m', message.body);
  }

  // 해당 scope에 속한 파일들만 커밋
  args.push('--', ...files);

  console.log(`\n[ai-commit] scope "${scope}" 에 대해 git ${args.join(' ')} 실행 중...\n`);

  const result = spawnSync('git', args, {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    console.error(`\n[ai-commit] git commit이 실패했습니다. (exit code: ${result.status})`);
    process.exit(result.status ?? 1);
  }
};

const main = async () => {
  const stagedFiles = getStagedFiles();
  const grouped = groupFilesByScope(stagedFiles);

  // scope 순서: root가 있으면 먼저, 그 다음은 알파벳 순
  const scopes = Object.keys(grouped).sort((a, b) => {
    if (a === 'root') return -1;
    if (b === 'root') return 1;
    return a.localeCompare(b);
  });

  console.log('[ai-commit] 감지된 scope들:', scopes.join(', '));

  for (const scope of scopes) {
    const files = grouped[scope];
    const diff = getScopedDiff(files);

    let aiMessage: CommitMessage;
    try {
      aiMessage = await generateCommitMessageForScope(scope, diff, files);
    } catch (err) {
      console.error('[ai-commit] 커밋 메시지 생성 중 오류:', err);
      process.exit(1);
      return;
    }

    const finalMessage = await askUserForDecision(scope, aiMessage);
    if (!finalMessage) {
      return;
    }

    runGitCommitForScope(scope, finalMessage, files);
  }

  console.log('\n[ai-commit] 모든 scope에 대한 커밋이 완료되었습니다.');
};

main().catch((err) => {
  console.error('[ai-commit] 예외 발생:', err);
  process.exit(1);
});
