// import React, { useState } from "react";
// import { useLocation } from "react-router-dom";
// import { readIpAddress } from "../scripts/utils";

// export default function VerifyChangePassword() {
//   const loc = useLocation();
//   const searchParams = new URLSearchParams(loc.search);
//   const verifyStatus = searchParams.get("status");
//   const token = searchParams.get("token");
//   const [labelButtonRelink, setLabelButtonRelink] = useState(
//     "คลิกเพื่อขอลิงก์ใหม่"
//   );
//   const onReLink = async () => {
//     setLabelButtonRelink((prev) => "รอสักครู่ กำลังส่งคำขอ...");
//     const ip = await readIpAddress();
//     const result = await fetch(
//       `${process.env.REACT_APP_BASE_URL}/auth/relink`,
//       {
//         method: "POST",
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify({ token, ip }),
//       }
//     ).then((r) => r.json());
//     if (result.status === "success") {
//       setLabelButtonRelink(
//         (prev) => "ส่งคำขอสำเร็จ กรุณาตรวจสอบอีเมล ลิงก์มีอายุ 5 นาที"
//       );
//     } else {
//       alert(result?.message || "เกิดข้อผิดพลาด");
//     }
//   };
//   return (
//     <div>
//       <div>
//         {verifyStatus === "success" && (
//           <div>
//             <p>เปลี่ยนรหัสผ่านสำเร็จ</p>
//             <p>
//               <a href="/">เข้าสู่หน้าเว็บ</a>
//             </p>
//           </div>
//         )}
//         {verifyStatus === "fail" && token && (
//           <div>
//             <p>เปลี่ยนรหัสผ่านไม่สำเร็จเนื่องจากลิงก์หมดอายุ</p>
//             <p>
//               <button onClick={onReLink}>{labelButtonRelink}</button>
//             </p>
//             <p>
//               <a href="/">เข้าสู่หน้าเว็บ</a>
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { readIpAddress } from "../scripts/utils";

export default function VerifyChangePassword() {
  const loc = useLocation();
  const searchParams = new URLSearchParams(loc.search);
  const verifyStatus = searchParams.get("status");
  const token = searchParams.get("token");
  const [labelButtonRelink, setLabelButtonRelink] = useState(
    "คลิกเพื่อขอลิงก์ใหม่"
  );

  const onReLink = async () => {
    setLabelButtonRelink("รอสักครู่ กำลังส่งคำขอ...");
    const ip = await readIpAddress();
    const result = await fetch(
      `${process.env.REACT_APP_BASE_URL}/auth/relink`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, ip }),
      }
    ).then((r) => r.json());

    if (result.status === "success") {
      setLabelButtonRelink(
        "ส่งคำขอสำเร็จ กรุณาตรวจสอบอีเมล ลิงก์มีอายุ 5 นาที"
      );
    } else {
      alert(result?.message || "เกิดข้อผิดพลาด");
    }
  };

  useEffect(() => {
    console.log({ verifyStatus, token });
  }, []);

  return (
    <div className="page-verify-change-password__container">
      <div className="page-verify-change-password__card">
        {verifyStatus === "success" && (
          <>
            <p className="page-verify-change-password__title">
              ✅ เปลี่ยนรหัสผ่านสำเร็จ
            </p>
            <p className="page-verify-change-password__text">
              <a className="page-verify-change-password__link" href="/">
                เข้าสู่หน้าเว็บ
              </a>
            </p>
          </>
        )}

        {verifyStatus === "fail" && token && (
          <>
            <p className="page-verify-change-password__title">
              ❌ ลิงก์หมดอายุ
            </p>
            <p className="page-verify-change-password__text">
              เปลี่ยนรหัสผ่านไม่สำเร็จเนื่องจากลิงก์หมดอายุ
            </p>
            <button
              className="page-verify-change-password__button"
              onClick={onReLink}
            >
              {labelButtonRelink}
            </button>
            <p style={{ marginTop: "15px" }}>
              <a className="page-verify-change-password__link" href="/">
                เข้าสู่หน้าเว็บ
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
