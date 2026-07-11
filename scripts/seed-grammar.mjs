import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const content = `<b>If-li gaplar (Conditionals)</b>

Shart ergash gaplar: 0, 1, 2, 3-Conditional, Unless va tez yodlash jadvali. Botda bo'limlarga ajratilgan.`;

  await prisma.grammarTopic.upsert({
    where: { slug: 'conditionals' },
    update: { title: 'If-li gaplar (Conditionals)', content },
    create: { slug: 'conditionals', title: 'If-li gaplar (Conditionals)', content },
  });

  const igContent = `<b>Infinitive va Gerund</b>

Fe'ldan keyin ikkinchi fe'l: Infinitive (to + verb) va Gerund (verb + ing). Botda bo'limlarga ajratilgan.`;

  await prisma.grammarTopic.upsert({
    where: { slug: 'infinitive-gerund' },
    update: { title: 'Infinitive va Gerund', content: igContent },
    create: { slug: 'infinitive-gerund', title: 'Infinitive va Gerund', content: igContent },
  });

  console.log('Seeded conditionals and infinitive-gerund topics.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
