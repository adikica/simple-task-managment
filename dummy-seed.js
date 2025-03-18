// npm install @faker-js/faker
// /prisma/dummy-seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  // Clear existing data (optional: uncomment to start fresh)
  await prisma.monthlyInvoiceLine.deleteMany({});
  await prisma.monthlyInvoice.deleteMany({});
  await prisma.currencyRate.deleteMany({});
  await prisma.fileAttachment.deleteMany({});
  await prisma.taskComment.deleteMany({});
  await prisma.taskNote.deleteMany({});
  await prisma.timeLog.deleteMany({});
  await prisma.userTask.deleteMany({});
  await prisma.taskStage.deleteMany({});
  await prisma.clientTask.deleteMany({});
  await prisma.taskList.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.clientGroup.deleteMany({});
  await prisma.userPaymentPreference.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.group.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.company.deleteMany({});

  // Create 3 companies
  for (let i = 1; i <= 3; i++) {
    const company = await prisma.company.create({
      data: {
        email: faker.internet.email(`company${i}`),
        passwordHash: await hashPassword('CompanyPass123'),
        companyName: faker.company.companyName(),
        representative: faker.name.findName(),
        address: faker.address.streetAddress(),
        phone: faker.phone.number('###-###-####'),
        website: faker.internet.url(),
      },
    });

    // Create Roles for the company
    const pmRole = await prisma.role.create({
      data: {
        name: 'Project Manager',
        permissions: {
          board: { create: true, viewAll: true, update: true, archive: true, reorder: true },
          list: { create: true, update: true, archive: true, reorder: true },
          task: { assign: true, trackTime: true },
          client: { manage: true, view: true },
        },
      },
    });
    const devRole = await prisma.role.create({
      data: {
        name: 'Developer',
        permissions: {
          task: { trackTime: true },
        },
      },
    });

    // Create 10 PM users and 50 Dev users for the company
    const pmUsers = [];
    for (let j = 1; j <= 10; j++) {
      const pmUser = await prisma.user.create({
        data: {
          companyId: company.id,
          group: {
            create: {
              companyId: company.id,
              name: `PM Group ${j}`,
              roleId: pmRole.id,
            },
          },
          name: faker.name.findName(),
          email: faker.internet.email(`pm${j}`, company.companyName),
          passwordHash: await hashPassword('UserPass123'),
          hourlyRate: faker.datatype.number({ min: 45, max: 60, precision: 0.01 }),
          currency: 'USD',
        },
      });
      pmUsers.push(pmUser);
    }
    for (let j = 1; j <= 50; j++) {
      await prisma.user.create({
        data: {
          companyId: company.id,
          group: {
            create: {
              companyId: company.id,
              name: `Dev Group ${j}`,
              roleId: devRole.id,
            },
          },
          name: faker.name.findName(),
          email: faker.internet.email(`dev${j}`, company.companyName),
          passwordHash: await hashPassword('UserPass123'),
          hourlyRate: faker.datatype.number({ min: 35, max: 50, precision: 0.01 }),
          currency: 'USD',
        },
      });
    }

    // Use the first PM user for assignments
    const pmUser = pmUsers[0];

    // Create a payment preference for the PM user.
    await prisma.userPaymentPreference.create({
      data: {
        userId: pmUser.id,
        method: 'paypal',
        details: { email: pmUser.email },
      },
    });

    // Create 10 client groups per company
    for (let k = 1; k <= 10; k++) {
      const clientGroup = await prisma.clientGroup.create({
        data: {
          companyId: company.id,
          name: `Client Group ${k}`,
          description: faker.lorem.sentence(),
        },
      });

      // For each client group, create 20 clients
      for (let l = 1; l <= 20; l++) {
        const client = await prisma.client.create({
          data: {
            companyId: company.id,
            clientGroupId: clientGroup.id,
            name: faker.company.companyName(),
            email: faker.internet.email(),
            phone: faker.phone.number('###-###-####'),
            address: faker.address.streetAddress(),
            notes: faker.lorem.sentences(2),
          },
        });

        // Create 5 task lists (boards) for each client
        for (let m = 1; m <= 5; m++) {
          const taskList = await prisma.taskList.create({
            data: {
              companyId: company.id,
              clientId: client.id,
              name: `List ${m}`,
              description: faker.lorem.sentence(),
              orderIndex: m,
            },
          });

          // For each list, create 20 client tasks
          for (let n = 1; n <= 20; n++) {
            const clientTask = await prisma.clientTask.create({
              data: {
                companyId: company.id,
                clientId: client.id,
                listId: taskList.id,
                title: faker.lorem.sentence(),
                description: faker.lorem.paragraph(),
                dueDate: faker.date.soon(30),
                overallStatus: faker.helpers.randomize(['Pending', 'In Progress', 'Completed']),
                financialInfo: { billingRate: faker.datatype.number({ min: 50, max: 100, precision: 0.01 }) },
                createdById: pmUser.id,
                orderIndex: n,
              },
            });

            // Create 2 task stages for each client task: "Design" and "Development"
            const designStage = await prisma.taskStage.create({
              data: {
                companyId: company.id,
                clientTaskId: clientTask.id,
                name: 'Design',
                description: `Design stage: ${faker.lorem.sentence()}`,
                orderIndex: 1,
                groupId: pmUser.groupId, // For demo, assign to PM group
              },
            });
            const devStage = await prisma.taskStage.create({
              data: {
                companyId: company.id,
                clientTaskId: clientTask.id,
                name: 'Development',
                description: `Development stage: ${faker.lorem.sentence()}`,
                orderIndex: 2,
                // Randomly assign a developer group
                groupId: (await prisma.group.findFirst({
                  where: { companyId: company.id, name: { contains: 'Dev Group' } },
                })).id,
              },
            });

            // For each stage, create 3 user tasks assigned to the PM user (for demo)
            for (let o = 1; o <= 3; o++) {
              const userTask = await prisma.userTask.create({
                data: {
                  clientTaskId: clientTask.id,
                  companyId: company.id,
                  assignedUserId: pmUser.id,
                  taskStageId: designStage.id,
                  title: `Subtask ${o} for Design`,
                  description: faker.lorem.sentences(2),
                  createdById: pmUser.id,
                  status: 'To Do',
                  orderIndex: o,
                },
              });
              // Create a time log for this user task
              await prisma.timeLog.create({
                data: {
                  userTaskId: userTask.id,
                  userId: pmUser.id,
                  hours: faker.datatype.float({ min: 0.5, max: 5, precision: 0.1 }),
                  notes: faker.lorem.sentence(),
                },
              });
              // Create a task note for this user task
              await prisma.taskNote.create({
                data: {
                  userTaskId: userTask.id,
                  userId: pmUser.id,
                  note: faker.lorem.sentence(),
                },
              });
              // Create a comment for this user task
              await prisma.taskComment.create({
                data: {
                  taskType: 'user_task',
                  taskId: userTask.id,
                  userId: pmUser.id,
                  content: faker.lorem.sentence(),
                },
              });
            }
          }
        }
      }
    }

    // Create dummy Currency Rates
    await prisma.currencyRate.createMany({
      data: [
        { currency: 'USD', rate: 1 },
        { currency: 'EUR', rate: 0.85 },
        { currency: 'CAD', rate: 1.25 },
      ],
    });

    // Create a dummy Monthly Invoice for the first PM user with random invoice lines
    const monthlyInvoice = await prisma.monthlyInvoice.create({
      data: {
        userId: pmUser.id,
        periodStart: new Date("2025-04-01T00:00:00Z"),
        periodEnd: new Date("2025-04-30T23:59:59Z"),
        totalAmount: 0,
      },
    });

    // Retrieve random valid client and task for invoice lines
    const randomClient = await prisma.client.findFirst({
      where: { companyId: company.id },
    });
    const randomTask = await prisma.clientTask.findFirst({
      where: { companyId: company.id },
    });

    for (let q = 1; q <= 10; q++) {
      await prisma.monthlyInvoiceLine.create({
        data: {
          monthlyInvoiceId: monthlyInvoice.id,
          clientId: randomClient.id,
          taskId: randomTask.id,
          taskLink: `http://localhost:3000/clients/${randomClient.id}/task/${randomTask.id}`,
          note: faker.lorem.sentence(),
          timeSpent: faker.datatype.float({ min: 1, max: 4, precision: 0.1 }),
          hourlyRate: pmUser.hourlyRate,
          currency: pmUser.currency,
          total: faker.datatype.float({ min: 50, max: 200, precision: 0.01 }),
          finishedAt: faker.date.recent(),
        },
      });
    }
  }
}

main()
  .then(() => {
    console.log("Dummy data seeding completed successfully.");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Error seeding data: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
