import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo", 10);

  const demoUser = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@gmail.com",
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  console.log("✅ Demo user created:", demoUser);

  // Create user accounts (portal accounts)
  const userAccounts = await prisma.userAccount.createMany({
    data: [
      {
        name: "Acme Corporation",
        location: "New York, NY",
        email: "contact@acme.com",
        phone: "+1-555-0123",
        address: "123 Business Ave, New York, NY 10001",
        createdById: demoUser.id,
      },
      {
        name: "TechStart Solutions",
        location: "San Francisco, CA",
        email: "hello@techstart.com",
        phone: "+1-555-0456",
        address: "456 Innovation Blvd, San Francisco, CA 94105",
        createdById: demoUser.id,
      },
      {
        name: "Global Enterprises",
        location: "Chicago, IL",
        email: "info@globalent.com",
        phone: "+1-555-0789",
        address: "789 Corporate Dr, Chicago, IL 60601",
        createdById: demoUser.id,
      },
      {
        name: "Green Energy Co",
        location: "Austin, TX",
        email: "support@greenenergy.com",
        phone: "+1-555-0321",
        address: "321 Eco Way, Austin, TX 73301",
        createdById: demoUser.id,
      },
    ],
  });

  console.log("✅ User accounts created:", userAccounts.count);

  // Fetch created accounts to get their IDs
  const createdAccounts = await prisma.userAccount.findMany({
    where: { createdById: demoUser.id },
  });

  // Create sample documents for each account
  const documentData = [
    // Acme Corporation documents
    {
      filename: "contract_2024_001.pdf",
      originalName: "Service Contract 2024-001.pdf",
      fileSize: 245760,
      mimeType: "application/pdf",
      filePath: "/uploads/documents/contract_2024_001.pdf",
      accountId: createdAccounts[0].id,
      uploadedById: demoUser.id,
    },
    {
      filename: "invoice_jan_2024.pdf",
      originalName: "Invoice January 2024.pdf",
      fileSize: 156320,
      mimeType: "application/pdf",
      filePath: "/uploads/documents/invoice_jan_2024.pdf",
      accountId: createdAccounts[0].id,
      uploadedById: demoUser.id,
    },
    // TechStart Solutions documents
    {
      filename: "proposal_web_dev.docx",
      originalName: "Web Development Proposal.docx",
      fileSize: 423680,
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      filePath: "/uploads/documents/proposal_web_dev.docx",
      accountId: createdAccounts[1].id,
      uploadedById: demoUser.id,
    },
    {
      filename: "tech_specs.pdf",
      originalName: "Technical Specifications.pdf",
      fileSize: 892160,
      mimeType: "application/pdf",
      filePath: "/uploads/documents/tech_specs.pdf",
      accountId: createdAccounts[1].id,
      uploadedById: demoUser.id,
    },
    // Global Enterprises documents
    {
      filename: "quarterly_report_q1.xlsx",
      originalName: "Q1 2024 Quarterly Report.xlsx",
      fileSize: 678400,
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      filePath: "/uploads/documents/quarterly_report_q1.xlsx",
      accountId: createdAccounts[2].id,
      uploadedById: demoUser.id,
    },
    {
      filename: "budget_analysis.pdf",
      originalName: "Budget Analysis 2024.pdf",
      fileSize: 334560,
      mimeType: "application/pdf",
      filePath: "/uploads/documents/budget_analysis.pdf",
      accountId: createdAccounts[2].id,
      uploadedById: demoUser.id,
    },
    // Green Energy Co documents
    {
      filename: "environmental_impact.pdf",
      originalName: "Environmental Impact Assessment.pdf",
      fileSize: 1245760,
      mimeType: "application/pdf",
      filePath: "/uploads/documents/environmental_impact.pdf",
      accountId: createdAccounts[3].id,
      uploadedById: demoUser.id,
    },
    {
      filename: "project_timeline.png",
      originalName: "Project Timeline Chart.png",
      fileSize: 289440,
      mimeType: "image/png",
      filePath: "/uploads/documents/project_timeline.png",
      accountId: createdAccounts[3].id,
      uploadedById: demoUser.id,
    },
  ];

  const documents = await prisma.document.createMany({
    data: documentData,
  });

  console.log("✅ Documents created:", documents.count);

  // Create a sample NextAuth account for the demo user (Google OAuth example)
  await prisma.account.create({
    data: {
      userId: demoUser.id,
      type: "oauth",
      provider: "google",
      providerAccountId: "demo_google_account_id",
      access_token: "demo_access_token",
      refresh_token: "demo_refresh_token",
      expires_at: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
      token_type: "Bearer",
      scope: "openid email profile",
    },
  });

  console.log("✅ OAuth account created for demo user");

  // Create a sample session
  await prisma.session.create({
    data: {
      sessionToken: "demo_session_token_" + Date.now(),
      userId: demoUser.id,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
    },
  });

  console.log("✅ Demo session created");

  // Summary
  console.log("\n🎉 Seeding completed successfully!");
  console.log("📊 Summary:");
  console.log(`   - 1 demo user created (demo@gmail.com / demo)`);
  console.log(`   - ${userAccounts.count} user accounts created`);
  console.log(`   - ${documents.count} sample documents created`);
  console.log(`   - 1 OAuth account created`);
  console.log(`   - 1 demo session created`);

  console.log("\n🔑 Login credentials:");
  console.log("   Email: demo@gmail.com");
  console.log("   Password: demo");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
