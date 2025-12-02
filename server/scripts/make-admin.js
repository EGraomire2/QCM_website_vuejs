import { pool } from '../config/database.js';

/**
 * Script to make a user an administrator
 * Usage: node server/scripts/make-admin.js <email>
 */

const email = process.argv[2];

if (!email) {
    console.error('❌ Usage: node server/scripts/make-admin.js <email>');
    process.exit(1);
}

async function makeAdmin() {
    try {
        // Check if user exists
        const [users] = await pool.execute(
            'SELECT ID_user, Nickname, Email, Administrator, Teacher FROM users WHERE Email = ?',
            [email]
        );

        if (users.length === 0) {
            console.error(`❌ User with email "${email}" not found`);
            process.exit(1);
        }

        const user = users[0];
        console.log('\n📊 Current user status:');
        console.log(`   - ID: ${user.ID_user}`);
        console.log(`   - Nickname: ${user.Nickname}`);
        console.log(`   - Email: ${user.Email}`);
        console.log(`   - Administrator: ${user.Administrator === 1 ? 'Yes' : 'No'}`);
        console.log(`   - Teacher: ${user.Teacher === 1 ? 'Yes' : 'No'}`);

        if (user.Administrator === 1) {
            console.log('\n✅ User is already an administrator');
            process.exit(0);
        }

        // Make user admin
        await pool.execute(
            'UPDATE users SET Administrator = 1, Teacher = 1 WHERE ID_user = ?',
            [user.ID_user]
        );

        console.log('\n✅ User successfully promoted to administrator!');
        console.log('💡 The user needs to log out and log back in for changes to take effect.');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

makeAdmin();
