import 'dotenv/config';
import { execSync } from 'node:child_process';
import OpenAI from 'openai';

async function main() {
  const apiKey = process.env.AI_COMMIT_API_KEY;
  const model = process.env.MODEL_NAME ?? 'gpt-4.1-mini';

  if (!apiKey) {
    console.error('OPENAI_API_KEY 가 설정되지 않았습니다 (.env 확인).');
    process.exit(1);
  }

  const diff = execSync('git diff --cached', { encoding: 'utf-8' }).trim();

  if (!diff) {
    console.error(
      '스테이징된 변경사항이 없습니다. 먼저 git add 를 실행하세요.'
    );
    process.exit(1);
  }

  const client = new OpenAI({ apiKey });

  const prompt = `
당신은 숙련된 소프트웨어 개발자입니다.
아래 git diff 를 보고 다음 규칙에 맞는 커밋 메시지를 딱 1개 생성하세요.

- 형식: <type>: <subject>
- type 은 feat, fix, refactor, docs, chore 중에서 선택
- subject 는 **한국어**로 간결하게 작성 (마침표 X)
- 72자를 넘기지 마세요.
- 추가 설명, bullet, 코드 블럭 없이 한 줄만 출력하세요.

git diff:
${diff}
  `.trim();

  const res = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: '당신은 git 커밋 메시지 전문가입니다.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
  });

  const content = res.choices[0]?.message?.content?.trim();

  if (!content) {
    console.error('AI가 커밋 메시지를 생성하지 못했습니다.');
    process.exit(1);
  }

  const firstLine = content.split('\n')[0].trim();
  process.stdout.write(firstLine);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
