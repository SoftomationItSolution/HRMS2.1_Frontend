import { Card, Col, Row } from "antd";
import React from "react";
import { Navigate } from "react-router-dom";
import checkTokenExp from "../../../utils/checkTokenExp";

import PublicHolidayBar from "./PublicHolidayBar";
import DemoLine from "./Demoline";
import AnnouncementBar from "./AnnouncementBar";
import AttendancePopup from "../../UI/PopUp/AttendancePopup";

const Dashboard = () => {
  const isLogged = Boolean(localStorage.getItem("isLogged"));

  if (!isLogged) {
    return <Navigate to={"/admin/auth/login"} replace={true} />;
  }

  // Logging Out if token is expired
  const accessToken = localStorage.getItem("access-token");
  checkTokenExp(accessToken);

  // Get the roleId
  const roleId = parseInt(localStorage.getItem("roleId"), 10);
  //   console.log("roleId: ",roleId)

  return (
    <>
      <div>
        <Row gutter={[30, 30]} justify={"space-between"}>
          <Col sm={24} md={24} lg={12} span={24} className="mb-auto">
            {/* <RangePicker
              onCalendarChange={onCalendarChange}
              defaultValue={defaultValue}
              format={"DD-MM-YYYY"}
              className="range-picker"
              style={{ maxWidth: "25rem" }}
            /> */}
          </Col>
          <Col sm={24} md={24} lg={12} span={24}>
            <div className="text-end mr-4">
              <AttendancePopup />
            </div>
          </Col>
        </Row>
		
		<section className='mt-5 mb-5'>

        <div>
          {roleId == 1 && (
            <div className="mb-3">
              <Row>
                <Col span={24}>
                  <DemoLine />
                </Col>
              </Row>
            </div>
          )}
          <div>
            <Row gutter={[30, 30]}>
              <Col sm={24} md={24} lg={12} span={24} className="mb-auto">
                <Card title="PUBLIC HOLIDAYS" className="">
                  <PublicHolidayBar />
                </Card>
              </Col>
              <Col sm={24} md={24} lg={12} span={24}>
                <Card title="ANNOUNCEMENTS">
                  <AnnouncementBar />
                </Card>
              </Col>
            </Row>
          </div>
        </div>
		</section>
      </div>
    </>
  );
};

export default Dashboard;
