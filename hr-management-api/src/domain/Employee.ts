import { GenderType } from "./enums/GenderType.js"

export class Employee {
    id: string;
    email: string;
    userName: string;
    passwordHash?: string;

    imageUrl?: string;
    backgroundImageUrl: string;
    name: string;
    secondName?: string;
    surname: string;
    secondSurname?: string;

    role?: string;
    get fullName(): string {
        const { name, secondName, surname, secondSurname } = this;
        if (!secondName && !secondSurname) return `${name} ${surname}`;
        if (!secondName && secondSurname) return `${name} ${surname} ${secondSurname}`;
        if (secondName && !secondSurname) return `${name} ${secondName} ${surname}`;
        return `${name} ${secondName ?? ""} ${surname} ${secondSurname ?? ""}`.replace(/\s+/g, " ").trim();
    }

    advanceAmount: number;

    birthPlace?: string;
    tc: string; // national id

    birthDate: Date;
    hiredDate?: Date | null;
    resignationDate?: Date | null;

    get isActive(): boolean {
        return !!(this.hiredDate && !this.resignationDate);
    }

    title: string;
    section: string;
    telephoneNumber: string;
    address: string;
    companyName: string;

    salary: number;
    gender: GenderType;
    maxAdvanceAmount: number;
}