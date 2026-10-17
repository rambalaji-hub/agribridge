import { randomUUID } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { RowDataPacket } from 'mysql2/promise';
import { getDatabase } from '../server/database';

dotenv.config({ path: ['.env.local', '.env'] });

function readHidden(promptText: string): Promise<string> {
  if (!stdin.isTTY) throw new Error('Run this command in a trusted interactive terminal to enter the administrator password securely.');
  stdout.write(promptText);
  stdin.setRawMode(true);
  stdin.resume();
  return new Promise((resolve, reject) => {
    let value = '';
    const onData = (chunk: Buffer) => {
      for (const character of chunk.toString()) {
        if (character === '\u0003') {
          stdin.setRawMode(false);
          stdin.off('data', onData);
          reject(new Error('Administrator setup cancelled.'));
          return;
        }
        if (character === '\r' || character === '\n') {
          stdin.setRawMode(false);
          stdin.off('data', onData);
          stdout.write('\n');
          resolve(value);
          return;
        }
        if (character === '\u007f' || character === '\b') {
          value = value.slice(0, -1);
        } else {
          value += character;
        }
      }
    };
    stdin.on('data', onData);
  });
}

const prompt = createInterface({ input: stdin, output: stdout });
try {
  const name = (await prompt.question('Administrator name: ')).trim();
  const identifier = (await prompt.question('Administrator ID: ')).trim();
  const mobile = (await prompt.question('Administrator mobile: ')).trim();
  const email = (await prompt.question('Administrator email (optional): ')).trim();
  prompt.close();
  const password = await readHidden('Password (8+ characters; input hidden): ');
  if (!name || !identifier || !/^[0-9+() -]{8,20}$/.test(mobile) || password.length < 8) {
    throw new Error('Provide a name, ID, valid mobile number, and password of at least 8 characters.');
  }

  const db = getDatabase();
  const [rows] = await db.query<RowDataPacket[]>("SELECT COUNT(*) AS admin_count FROM users WHERE role = 'admin'");
  if (Number(rows[0].admin_count) > 0) throw new Error('An administrator already exists; use authenticated admin account provisioning instead.');
  await db.execute(
    `INSERT INTO users (id, name, role, identifier, mobile, email, password_hash, location, state, district, verification_status)
     VALUES (?, ?, 'admin', ?, ?, ?, ?, 'System administration', 'System', 'System', 'verified')`,
    [randomUUID(), name, identifier, mobile, email || null, await bcrypt.hash(password, 12)],
  );
  console.log('Initial administrator account created.');
} finally {
  prompt.close();
}
