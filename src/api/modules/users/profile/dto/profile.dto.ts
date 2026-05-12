export interface IProfileDto {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    santriProfile: {
        id: string;
        userId: string;
        waliId: string;
        phone: string;
        birthDate: Date;
        address: string;
        photoUrl: string;
        classId: string;
    };
}