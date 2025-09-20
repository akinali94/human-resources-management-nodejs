import argon2 from "argon2";

export async function hashPassword(plain: string): Promise<string> {
    return argon2.hash(plain, { type: 
        argon2.argon2id, 
        memoryCost: 19456, 
        timeCost: 2, 
        parallelism: 1 
    });
}


export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
    return argon2.verify(hash, plain);
}