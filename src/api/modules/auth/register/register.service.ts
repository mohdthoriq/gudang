import bcrypt from "bcrypt";
import { checkEmailRepo, getNisSantri, registerRepo } from "./register.repo.js";
import type { IRegisterData } from "./register.schema.js";
import { createOtp } from "../email/otp.repo.js";
import { sendEmail } from "../../../utils/brevo.js";
import { AppError } from "../../../appErr.js";

export const registerService = async (data: IRegisterData) => {
    const user = await checkEmailRepo(data.email);
    if (user) {
        throw new AppError("Email already exists", 400);
    }
    
    let generatedNis = data.nis
    if(data.role === "SANTRI" && !generatedNis) {
      const sekarang = new Date()
      const tahunSekarang = sekarang.getFullYear()
      const bulanSekarang = sekarang.getMonth()

      const tahunAwal = 2026
      const angkatanAwal = 24

      const tambahSemester = bulanSekarang >= 6 ? 1:0
      const selisihTahun = tahunSekarang - tahunAwal

      const angkatan = angkatanAwal + (selisihTahun*2) + tambahSemester
      const angkatanSTR = angkatan.toString().padStart(2, '0')

      const prefixNis = `${tahunSekarang}${angkatanSTR}`

      const santriTerakhir = await getNisSantri(prefixNis)
      let urutan = 1

      if (santriTerakhir && santriTerakhir.nis) {
        const urutanTerakhir = parseInt(santriTerakhir.nis.slice(-3), 10)
        urutan = urutanTerakhir + 1
      }

      const urutanSTR = urutan.toString().padStart(3, '0')
      generatedNis = `${prefixNis}${urutanSTR}`
    }


    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await registerRepo({
        ...data,
        nis: generatedNis,
        password: hashedPassword,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await createOtp(newUser.id, otp);
    await sendEmail({
        to: data.email,
        subject: "Verify your email",
        html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 20px; text-align: center;">
        
        <h2 style="color: #333;">Verify Your Email</h2>
        
        <p style="color: #555; font-size: 14px;">
          Use the OTP below to verify your account
        </p>

        <div style="margin: 20px 0;">
          <span style="
            display: inline-block;
            background: #000;
            color: #fff;
            padding: 12px 24px;
            font-size: 20px;
            letter-spacing: 4px;
            border-radius: 8px;
          ">
            ${otp}
          </span>
        </div>

        <p style="color: #999; font-size: 12px;">
          This OTP is valid for a limited time. Do not share it with anyone.
        </p>

        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />

        <p style="font-size: 12px; color: #aaa;">
          If you didn’t request this, you can ignore this email.
        </p>

      </div>
    </div>
  `,
  textContent:"haloo"
    });

    return newUser;
}