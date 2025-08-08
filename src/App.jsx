import React, { useEffect, useState } from "react";
import bg from "./assets/images/bg.svg";

export default function App() {
  const [title, setTitle] = useState("ตรวจสอบ OTC");
  const [selection, setSelection] = useState(1);
  const [database, setDatabase] = useState([]);
  const [dataFound, setDataFound] = useState(false);
  const [checkOtc, setCheckOtc] = useState("");
  const [organization, setOrganization] = useState("");
  const [organizationOtc, setOrganizationOtc] = useState("");
  const [reqOtcForm, setReqOtcForm] = useState({ email: "", password: "" });
  const [changePasswordForm, setChangePasswordForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [labelButtonSubmitChangePassword, setLabelButtonSubmitChangePassword] =
    useState("ตกลง");
  const [reqOtcData, setReqOtcData] = useState();
  const buttonList = [
    {
      label: "ตรวจสอบ OTC",
      value: 1,
    },
    {
      label: "ขอ OTC",
      value: 2,
    },
    {
      label: "ลงทะเบียน",
      value: 3,
    },
    {
      label: "อ่านคำอธิบาย",
      value: 4,
    },
    {
      label: "ฐานข้อมูล",
      value: 5,
    },
  ];

  const onChangeReqOtcForm = (statement, value) =>
    setReqOtcForm((prev) => ({ ...prev, [statement]: value }));

  const onChangeChangePasswordForm = (statement, value) =>
    setChangePasswordForm((prev) => ({ ...prev, [statement]: value }));

  const getDatabase = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BASE_URL}/utils/database`
    ).then((r) => r.json());
    setDatabase(res.map((el) => ({ organization: el })));
  };

  const fetchCheckOtc = async () => {
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/otc/check`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ otc: checkOtc }),
    }).then((r) => r.json());
    const temp = res?.organization;
    if (temp) {
      setOrganization(temp);
      setOrganizationOtc(checkOtc);
      setDataFound(true);
    } else {
      setOrganization("");
      setOrganizationOtc("");
      setDataFound(false);
    }
  };

  const onSubmitReqOtc = async () => {
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/otc`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: reqOtcForm.email,
        password: reqOtcForm.password,
      }),
    }).then((r) => r.json());
    setReqOtcData(res);
    const hasData = res?.otc;
    if (hasData) {
      setSelection(2.4);
    }
  };

  const onSubmitChangePasswordForm = async () => {
    const { email, newPassword, confirmPassword } = changePasswordForm;
    const correctPassword = newPassword === confirmPassword;
    if (correctPassword === false) return;
    const validate = email && newPassword && confirmPassword;
    if (validate === false) return;
    setLabelButtonSubmitChangePassword((prev) => "กำลังส่งคำขอ...");
    const res = await fetch(
      `${process.env.REACT_APP_BASE_URL}/auth/changePassword`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password: newPassword }),
      }
    ).then((r) => r.json());
    if (res.status === "success") {
      setLabelButtonSubmitChangePassword(
        (prev) => "ส่งคำขอสำเร็จ กรุณาตรวจสอบอีเมล"
      );
    }
    setLabelButtonSubmitChangePassword((prev) => "ตกลง");
  };

  const onExitReqOtc = () => {
    setReqOtcForm({ email: "", password: "" });
    setSelection(2);
  };

  useEffect(() => {
    getDatabase();
  }, []);
  useEffect(() => {
    if (checkOtc.length === 6) {
      fetchCheckOtc();
    }
  }, [checkOtc]);
  return (
    <div className="app">
      <div className="bg">
        <img src={bg} alt="bg" />
      </div>
      <h1>ระบบยืนยันตัวตนองค์กร</h1>
      <div className="app-container">
        <div className="app-content">
          <h2>{title}</h2>
          {selection === 1 && (
            <div className="selection-1">
              <div>
                <input
                  onChange={(e) => {
                    const value = e.target.value;
                    setCheckOtc(value);
                  }}
                  maxLength={6}
                  value={checkOtc}
                  className="input-check-otc"
                  type="text"
                  placeholder="131296"
                />
              </div>
              {(checkOtc.length === 6 || organizationOtc) && (
                <div className="selection-1__data">
                  {dataFound ? (
                    <div className="data-found">
                      <p className="data-found__organization">{organization}</p>
                      <p className="data-found__text">
                        {`ข้อมูลนี้จะปรากฏเพียงครั้งเดียวสำหรับ OTC ${organizationOtc}`}
                      </p>
                    </div>
                  ) : (
                    <div className="data-not-found">
                      <p className="data-not-found__text">ไม่พบข้อมูล</p>
                      <p className="data-not-found__description">
                        กรุณาขอ OTC จากคู่สายของคุณอีกครั้งหรือวางสาย
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {selection === 2 && (
            <div className="selection-2">
              <div>
                <label>อีเมล</label>
                <input
                  onChange={(e) => onChangeReqOtcForm("email", e.target.value)}
                  type="email"
                  placeholder="example@mail.com"
                />
              </div>
              <div>
                <label>รหัสผ่าน</label>
                <input
                  onChange={(e) =>
                    onChangeReqOtcForm("password", e.target.value)
                  }
                  type="password"
                  placeholder="******"
                />
              </div>
              <div>
                <label
                  onClick={() => {
                    setTitle("เปลี่ยนรหัสผ่าน");
                    setSelection(2.5);
                  }}
                  className="change-password"
                >
                  เปลี่ยนรหัสผ่าน
                </label>
              </div>
              <div>
                <button
                  onClick={onSubmitReqOtc}
                  className="button-primary-fill"
                >
                  ตกลง
                </button>
              </div>
            </div>
          )}
          {selection === 2.4 && (
            <div className="selection-2">
              <div className="otc-card">
                <h3>รหัส OTC ของคุณ</h3>
                <p className="p-box">{reqOtcData.otc}</p>
                <h3>ชื่อองค์กร</h3>
                <p className="p-box">{reqOtcData.organization}</p>
                <p className="otc-card-detail">
                  กรุณาแจ้ง <strong>รหัส OTC</strong> และ
                  <strong> ชื่อองค์กร </strong>
                  ตามข้อมูลที่ปรากฏนี้ให้ผู้รับสายเพื่อ “ตรวจ OTC” ในเว็บ{" "}
                  <span className="otg-geeleed-com">otc.geeleed.com</span>
                </p>
              </div>
              <div>
                <button
                  onClick={onSubmitReqOtc}
                  className="button-primary-fill"
                >
                  ขอ OTC อีกครั้ง
                </button>
              </div>
              <div>
                <button
                  onClick={onExitReqOtc}
                  className="button-primary-outline button-primary-outline--exit"
                >
                  ออก
                </button>
              </div>
            </div>
          )}
          {selection === 2.5 && (
            <div className="selection-2">
              <div>
                <label>อีเมล</label>
                <input
                  onChange={(e) =>
                    onChangeChangePasswordForm("email", e.target.value)
                  }
                  value={changePasswordForm.email}
                  type="email"
                  placeholder="example@mail.com"
                />
              </div>
              <div>
                <label>รหัสผ่านใหม่</label>
                <input
                  onChange={(e) =>
                    onChangeChangePasswordForm("newPassword", e.target.value)
                  }
                  value={changePasswordForm.newPassword}
                  type="password"
                  placeholder="******"
                />
              </div>
              <div>
                <label>ยืนยันรหัสผ่าน</label>
                <input
                  onChange={(e) =>
                    onChangeChangePasswordForm(
                      "confirmPassword",
                      e.target.value
                    )
                  }
                  value={changePasswordForm.confirmPassword}
                  type="password"
                  placeholder="******"
                />
              </div>
              <div>
                <button
                  onClick={onSubmitChangePasswordForm}
                  className="button-primary-fill"
                >
                  {labelButtonSubmitChangePassword}
                </button>
              </div>
            </div>
          )}
          {selection === 3 && (
            <div className="selection-3">
              <div>
                <p>
                  การลงทะเบียนจำเป็นต้องยืนยันตัวตนทางกายภาพและมีข้อมูลเพียงพอสำหรับการพิสูจน์ตัวตน
                  บัญชีจะถูกสร้างโดยเจ้าหน้าที่และแจ้งให้แก่ผู้ลงทะเบียน
                  กรุณากรอกข้อมูลสำหรับการติดต่อ
                </p>
              </div>
              <div>
                <label>ชื่อ</label>
                <input type="text" placeholder="geeleed" />
              </div>
              <div>
                <label>อีเมล</label>
                <input type="email" placeholder="example@mail.com" />
              </div>
              <div>
                <label>เบอร์โทร</label>
                <input type="tel" placeholder="0812345678" />
              </div>
              <div>
                <button className="button-primary-fill">ตกลง</button>
              </div>
            </div>
          )}
          {selection === 4 && (
            <div className="selection-4">
              <div>
                <p>
                  <strong>ระบบยืนยันตัวตนองค์กร</strong>{" "}
                  ถูกสร้างขึ้นเพื่อแก้ปัญหาเรื่องมิจฉาชีพโทรหลอกลวงโดยแอบอ้างชื่อองค์กรหรือหน่วยงานต่าง
                  ๆ
                </p>
                <h3>แนวคิด</h3>
                <p>
                  แนวคิดคือการใช้คนกลาง เมื่อองค์กรโทรหาลูกค้า (หรือผู้รับสาย)
                  องค์กรต้องมี <strong>OTC (One Time Code)</strong>{" "}
                  ซึ่งต้องขอจาก “ระบบยืนยันตัวตนองค์กร” จากนั้นแจ้ง OTC
                  และชื่อองค์กรที่ได้รับจากระบบให้แก่ผู้รับสายผ่านการสนทนาได้ทราบ
                  ผู้รับสายจะนำ OTC
                  มาตรวจสอบผ่านหน้าเว็บระบบยืนยันตัวตนองค์กรว่าได้ชื่อองค์กรตรงตามที่บอกหรือไม่
                  โดย 1 OTC จะใช้ตรวจสอบได้ 1 ครั้งและ OTC มีอายุ 3 นาที
                </p>
                <h3>ทำไม OTC ต้องตรวจสอบได้ 1 ครั้ง?</h3>
                <p>
                  สมมุติว่า OTC ในที่นี้สามารถใช้ตรวจสอบได้มากกว่า 1 ครั้ง
                  แล้วสมมุติผมเป็นมิจฉาชีพและมีเหตุบังเอิญว่า
                  องค์กรจริงแห่งหนึ่งขอ OTC จากระบบขึ้นมาพอดี แล้วผมสุ่ม OTC
                  นั้นได้พอดี เมื่อตรวจในระบบก็พบข้อมูล เช่น ชื่อองค์กร
                  แล้วผมโทรหาเหยื่อ บอก OTC ที่ผมเพิ่งบังเอิญสุ่มได้มา
                  ให้เหยือตรวจสอบ
                  แน่นอนว่าเหยื่อก็จะพบข้อมูลเดียวกันกับผมซึ่งเป็นมิจฉาชีพ
                  ดังนั้นด้วยความน่าเชื่อถือของระบบ
                  จึงทำให้ผมซึ่งเป็นมิจฉาชีพถูกยืนยันว่าน่าเชื่อถือไปด้วยโดยอัตโนมัติ
                  ฉะนั้น OTC ควรใช้ได้ครั้งเดียว ควรถูกทำลายทันทีเมื่อถูกใช้งาน
                </p>
                <p>
                  คราวนี้สมมุติว่า OTC ใช้ตรวจสอบได้ครั้งเดียว
                  และสมมุติเหตุบังเอิญเช่นเดิม ผมตรวจ OTC ในระบบได้ข้อมูล เช่น
                  ชื่อองค์กร แต่คราวนี้เมื่อผมโทรหาเหยื่อแล้วบอก OTC อีกครั้ง
                  เหยื่อจะไม่พบข้อมูล ทำให้บอกไม่ได้ว่าผมน่าเชื่อถือหรือไม่
                  ผมต้องขอ OTC ใหม่จากระบบเพื่อบอกเหยื่อ แต่การจะขอ OTC
                  จากระบบได้นั้นต้องใช้บัญชีสำหรับขอ OTC
                  ซึ่งต้องผ่านการลงทะเบียนเพื่อยืนยันตัวตนจริงจากระบบมาก่อนแล้ว
                  ดังนั้นการทำให้ OTC
                  ใช้ได้ครั้งเดียวจะป้องกันการแอบอ้างดังกล่าวได้
                </p>
                <h3>จำเป็นต้องสร้างการรับรู้</h3>
                <p>
                  องค์กรหรือหน่วยงานสำคัญ อย่างหน่วยงานรัฐบาลหรือธนาคาร
                  ต้องสามารถยืนยันตัวตนของตัวเองได้
                  และต้องกระจายข่าวสารให้มากที่สุดแก่ทุกคนได้รู้ว่ามีเว็บไซต์ตรวจสอบตัวตนหรือ
                  “ระบบยืนยันตัวตนองค์กร” นี้ เพื่อให้ทุกคนร้องขอ OTC
                  มาตรวจสอบทุกครั้งที่มีการสนทนากับองค์กรหรือหน่วยงานที่สำคัญ
                  ป้องกันการถูกแอบอ้าง
                </p>
                <h3>ข้อจำกัดสำคัญ!</h3>
                <p>
                  ระบบนี้จำเป็นต้องใช้ internet เพื่อเข้าสู่เว็บไซต์สำหรับตรวจ
                  OTC และระดับของความน่าเชื่อถือของตัว “ระบบยืนยันตัวตนองค์กร”
                  เองก็สำคัญมาก
                </p>
              </div>
            </div>
          )}
          {selection === 5 && (
            <div className="selection-5">
              {database.map((el, index) => (
                <div>
                  <span>
                    {index + 1}
                    {".) "}
                  </span>
                  <span>{el.organization}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <nav>
          {buttonList.map((el, index) => (
            <button
              key={index}
              className={
                el.value === selection ? "button-active" : "button-inactive"
              }
              onClick={() => {
                setTitle(el.label);
                setSelection(el.value);
              }}
            >
              {el.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="footer">
        <footer>Dev by Geeleed</footer>
      </div>
    </div>
  );
}
