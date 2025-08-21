const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // チームみらいの政治組織データを作成
    // 既存のデータがあるかチェック
    const existingTeamMirai = await prisma.politicalOrganization.findFirst({
        where: { slug: 'team-mirai' }
    });

    let teamMirai;
    if (!existingTeamMirai) {
        teamMirai = await prisma.politicalOrganization.create({
            data: {
                name: 'チームみらい',
                slug: 'team-mirai',
                description: 'チームみらい（Team Mirai）は、日本の政党。2024年東京都知事選挙でAIエンジニアの安野貴博のもとに集まった「チーム安野」を前身として、2025年5月8日に設立された。安野が党首を務めている。第27回参議院議員通常選挙において政党要件を満たし、国政政党となった。公職選挙法における略称は「みらい」。',
            },
        });
    } else {
        console.log('Political organization already exists:', existingTeamMirai);
        teamMirai = existingTeamMirai;
    }

    console.log('Created political organization:', teamMirai);

    // Create admin user for local development
    await seedAdminUser();

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

// Admin user seeding function
async function seedAdminUser() {
    console.log('Creating admin user...');

    // Default credentials for local development
    const DEFAULT_EMAIL = 'foo@example.com';
    const DEFAULT_PASSWORD = 'bar@example.com';

    // Get Supabase configuration from environment variables
    const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
        console.log('⚠️  Warning: SUPABASE_SERVICE_ROLE_KEY not found - skipping admin user creation');
        console.log('   To create admin user, ensure SUPABASE_SERVICE_ROLE_KEY is set in .env');
        return;
    }

    // Create Supabase client with service role key for admin operations
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    try {
        // Check if user already exists
        const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) {
            throw new Error(`Failed to list users: ${listError.message}`);
        }

        const existingUser = existingUsers.users?.find(user => user.email === DEFAULT_EMAIL);

        if (existingUser) {
            console.log(`✅ Admin user '${DEFAULT_EMAIL}' already exists`);
            return;
        }

        // Create the admin user
        const { error: createError } = await supabase.auth.admin.createUser({
            email: DEFAULT_EMAIL,
            password: DEFAULT_PASSWORD,
            email_confirm: true, // Skip email confirmation for local development
        });

        if (createError) {
            throw new Error(`Failed to create user: ${createError.message}`);
        }

        console.log('✅ Admin user created successfully!');
        console.log(`   Email: ${DEFAULT_EMAIL}`);
        console.log(`   Password: ${DEFAULT_PASSWORD}`);
        console.log('   You can now log in to the admin panel at http://localhost:3001/login');

    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        console.log('   Admin user creation failed, but database seeding will continue');
    }
}
