import React, { useEffect, useRef, useState } from "react";
import bg from "./assets/images/bg.svg";
import { readIpAddress } from "./scripts/utils";

export default function App() {
  const [title, setTitle] = useState("ตรวจสอบ OTC");
  const [selection, setSelection] = useState(1);
  const [database, setDatabase] = useState([]);
  const [dataFound, setDataFound] = useState(false);
  const [checkOtc, setCheckOtc] = useState("");
  const [organization, setOrganization] = useState("");
  const [organizationOtc, setOrganizationOtc] = useState("");

  const initReqOtcForm = { email: "", password: "" };
  const initReqRegisterForm = {
    name: "",
    email: "",
    tel: "",
    description: "",
  };
  const initChangePasswordForm = {
    email: "",
    newPassword: "",
    confirmPassword: "",
  };

  const [reqOtcForm, setReqOtcForm] = useState(initReqOtcForm);
  const [reqRegisterForm, setReqRegisterForm] = useState(initReqRegisterForm);
  const [changePasswordForm, setChangePasswordForm] = useState(
    initChangePasswordForm
  );

  const [labelButtonSubmitChangePassword, setLabelButtonSubmitChangePassword] =
    useState("ตกลง");
  const [labelButtonSubmitReqRegister, setLabelButtonSubmitReqRegister] =
    useState("ตกลง");
  const [reqOtcData, setReqOtcData] = useState();

  const refReqOtcFormEmail = useRef();
  const refReqOtcFormPassword = useRef();

  const refChangePasswordFormEmail = useRef();
  const refChangePasswordFormNewPassword = useRef();
  const refChangePasswordFormConfirmPassword = useRef();

  const refReqRegisterFormName = useRef();
  const refReqRegisterFormEmail = useRef();

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

  const onChangeReqOtcForm = (event) => {
    const { name, value } = event.target;
    setReqOtcForm((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeReqRegisterForm = (event) => {
    const { name, value } = event.target;
    setReqRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeChangePasswordForm = (event) => {
    const { name, value } = event.target;
    setChangePasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const getDatabase = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BASE_URL}/utils/database`
    ).then((r) => r.json());
    setDatabase(res.map((el) => ({ organization: el })));
  };

  const fetchCheckOtc = async () => {
    setDataFound(false);
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

  const onSubmitReqOtc = async (event) => {
    event.preventDefault();

    const { email, password } = reqOtcForm;

    if (!email) return refReqOtcFormEmail.current.focus();
    if (!password) return refReqOtcFormPassword.current.focus();

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

    if (res.status === "success") {
      setReqOtcData(res);
      const hasData = res?.otc;
      if (hasData) {
        setSelection(2.4);
      }
    } else {
      alert("ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบข้อมูล");
    }
  };

  const onSubmitChangePasswordForm = async (event) => {
    event.preventDefault();

    const { email, newPassword, confirmPassword } = changePasswordForm;

    if (!email) return refChangePasswordFormEmail.current.focus();
    if (!newPassword) return refChangePasswordFormNewPassword.current.focus();
    if (!confirmPassword)
      return refChangePasswordFormConfirmPassword.current.focus();

    const ip = await readIpAddress();
    const correctPassword = newPassword === confirmPassword;
    if (correctPassword === false) return;
    const validate = email && newPassword && confirmPassword;
    if (validate === false) return;
    setLabelButtonSubmitChangePassword("รอสักครู่ กำลังส่งคำขอ...");
    const res = await fetch(
      `${process.env.REACT_APP_BASE_URL}/auth/changePassword`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password: newPassword, ip }),
      }
    ).then((r) => r.json());
    if (res.status === "success") {
      setChangePasswordForm(initChangePasswordForm);
      alert("ส่งคำขอสำเร็จ กรุณาตรวจสอบอีเมล ลิงก์มีอายุ 5 นาที");
    } else {
      alert("ส่งคำขอล้มเหลว กรุณาลองอีกครั้ง");
    }
    setLabelButtonSubmitChangePassword("ตกลง");
  };

  const onSubmitReqRegisterForm = async (event) => {
    event.preventDefault();

    const { name, email, tel, description } = reqRegisterForm;

    if (!name) return refReqRegisterFormName.current.focus();
    if (!email) return refReqRegisterFormEmail.current.focus();

    setLabelButtonSubmitReqRegister("รอสักครู่ กำลังส่งคำขอ...");

    const result = await fetch(
      `${process.env.REACT_APP_BASE_URL}/otc/requestRegister`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, tel, description }),
      }
    ).then((r) => r.json());

    if (result.status === "success") {
      setReqRegisterForm(initReqRegisterForm);
      alert("ส่งข้อมูลสำเร็จ");
    } else {
      alert("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
    }
    setLabelButtonSubmitReqRegister("ตกลง");
  };

  const onExitReqOtc = () => {
    setReqOtcForm(initReqOtcForm);
    setSelection(2);
  };

  const CODE_LENGTH = 4;

  const onChangeCheckOtc = (event) => {
    const value = event.target.value;
    setCheckOtc(value.toUpperCase());
  };

  useEffect(() => {
    getDatabase();
  }, []);
  useEffect(() => {
    if (checkOtc.length === CODE_LENGTH) {
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
                <p className="recommend-message-request-otc">
                  {`กรุณาขอรหัส OTC ${CODE_LENGTH} หลักจากคู่สายของคุณเพื่อตรวจสอบตัวตน`}
                </p>
              </div>
              <div>
                <input
                  onChange={onChangeCheckOtc}
                  maxLength={CODE_LENGTH}
                  value={checkOtc}
                  className="input-check-otc"
                  type="text"
                  placeholder={"DC96".slice(0, CODE_LENGTH)}
                />
              </div>
              {(checkOtc.length === CODE_LENGTH || organizationOtc) && (
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
            <form className="selection-2">
              <div>
                <label>อีเมล *</label>
                <input
                  onChange={onChangeReqOtcForm}
                  ref={refReqOtcFormEmail}
                  name="email"
                  type="email"
                  placeholder="example@mail.com"
                />
              </div>
              <div>
                <label>รหัสผ่าน *</label>
                <input
                  onChange={onChangeReqOtcForm}
                  ref={refReqOtcFormPassword}
                  name="password"
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
            </form>
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
            <form className="selection-2">
              <div>
                <label>อีเมล *</label>
                <input
                  onChange={onChangeChangePasswordForm}
                  ref={refChangePasswordFormEmail}
                  name="email"
                  value={changePasswordForm.email}
                  type="email"
                  placeholder="example@mail.com"
                />
              </div>
              <div>
                <label>รหัสผ่านใหม่ *</label>
                <input
                  onChange={onChangeChangePasswordForm}
                  ref={refChangePasswordFormNewPassword}
                  name="newPassword"
                  value={changePasswordForm.newPassword}
                  type="password"
                  placeholder="******"
                />
              </div>
              <div>
                <label>ยืนยันรหัสผ่าน *</label>
                <input
                  onChange={onChangeChangePasswordForm}
                  ref={refChangePasswordFormConfirmPassword}
                  name="confirmPassword"
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
            </form>
          )}
          {selection === 3 && (
            <form className="selection-3">
              <div>
                <p>
                  การลงทะเบียนจำเป็นต้องยืนยันตัวตนทางกายภาพและมีข้อมูลเพียงพอสำหรับการพิสูจน์ตัวตน
                  บัญชีจะถูกสร้างโดยเจ้าหน้าที่และแจ้งให้แก่ผู้ลงทะเบียน
                  กรุณากรอกข้อมูลสำหรับการติดต่อ
                </p>
              </div>
              <div>
                <label>ชื่อ *</label>
                <input
                  onChange={onChangeReqRegisterForm}
                  ref={refReqRegisterFormName}
                  name="name"
                  value={reqRegisterForm.name}
                  type="text"
                  placeholder="geeleed"
                />
              </div>
              <div>
                <label>อีเมล *</label>
                <input
                  onChange={onChangeReqRegisterForm}
                  ref={refReqRegisterFormEmail}
                  name="email"
                  value={reqRegisterForm.email}
                  type="email"
                  placeholder="example@mail.com"
                />
              </div>
              <div>
                <label>เบอร์โทร</label>
                <input
                  onChange={onChangeReqRegisterForm}
                  name="tel"
                  value={reqRegisterForm.tel}
                  type="tel"
                  placeholder="0812345678"
                />
              </div>
              <div>
                <label>รายละเอียด</label>
                <textarea
                  onChange={onChangeReqRegisterForm}
                  name="description"
                  value={reqRegisterForm.description}
                  rows={4}
                  placeholder="กรอกรายละเอียดเพื่อการตรวจสอบเบื้องต้น"
                />
              </div>
              <div>
                <button
                  onClick={onSubmitReqRegisterForm}
                  className="button-primary-fill"
                >
                  {labelButtonSubmitReqRegister}
                </button>
              </div>
            </form>
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
                  องค์กรหรือหน่วยงานสำคัญ เช่น
                  หน่วยงานรัฐบาลหรือเจ้าหน้าที่ราชการ
                  ต้องสามารถยืนยันตัวตนของตัวเองได้
                  และต้องเผยแพร่เว็บไซต์ให้เป็นที่รู้จักแก่ทุกคนเพื่อให้ทุกคนร้องขอ
                  OTC
                  มาตรวจสอบทุกครั้งที่มีการสนทนากับองค์กรหรือหน่วยงานที่สำคัญ
                  ป้องกันการถูกแอบอ้าง
                </p>
                <h3>ข้อจำกัดสำคัญ!</h3>
                <p>
                  ระบบนี้จำเป็นต้องใช้ internet เพื่อเข้าสู่เว็บไซต์สำหรับตรวจ
                  OTC และ<strong>ระดับของความน่าเชื่อถือ</strong>ของตัว “
                  <strong>ระบบยืนยันตัวตนองค์กร</strong>” เองก็สำคัญมาก
                </p>
              </div>
            </div>
          )}
          {selection === 5 && (
            <div className="selection-5">
              {database.map((el, index) => (
                <div key={index}>
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
        <footer>
          <a href="https://github.com/Geeleed" target="_blank" rel="noreferrer">
            Dev by Geeleed
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-github"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
            </svg>
          </a>
        </footer>
      </div>
    </div>
  );
}
