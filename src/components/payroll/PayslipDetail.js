import { Col, Row, Image, Avatar, Typography, Divider, Button } from "antd";
import dayjs from "dayjs";
import React, {
	forwardRef,
	Fragment,
	useEffect,
	useRef,
	useState,
} from "react";
import { useReactToPrint } from "react-to-print";
import getSetting from "../../api/getSettings";

import { useDispatch, useSelector } from "react-redux";
import {
	clearPayroll,
	loadSinglePayslip,
} from "../../redux/rtk/features/payroll/payrollSlice";
import { useParams } from "react-router-dom";
import PrintIconSVG from "../Icons/PrintIconSVG";
import tw from "tailwind-styled-components";
import Loader from "../loader/loader";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";

const PrintToPdf = forwardRef(({ data, invoiceData }, ref) => {
	const { Title } = Typography;
	return (
		<Fragment>
			<div ref={ref} className='wrapper'>
				<Col className='container mx-auto px-4 my-20'>
					<Row justify='center'>
						<PrintIconSVG />
					</Row>
					<Row justify='center'>
						<h1 className='text-3xl font-semibold text-slate-600 mt-2 mb-8'>
							SALARY SLIP
						</h1>
					</Row>
					<Row>
						{/* show Avatar with url */}
						<Col span={6}>
							<TitleText>{invoiceData?.company_name.toUpperCase()}</TitleText>
							<TitleText2>{invoiceData?.email || "demo@demo.com"}</TitleText2>

							<TitleText2>{invoiceData?.phone}</TitleText2>
						</Col>

						<Col span={6}>
							<TitleText>
								{(data.user.firstName + " " + data.user.lastName).toUpperCase()}
							</TitleText>
							<TitleText2>{data.user.email || "demo@demo.com"}</TitleText2>
							<TitleText2>{data.user.phone || "+91-9999999999"}</TitleText2>
						</Col>

						<Col span={6}>
							<p>
								<TitleText>Salary:</TitleText> Rs. {data.salary}
							</p>
							<TitleText>Work Day: </TitleText> {data.workDay}
							<p>
								<TitleText>Working Hour: </TitleText> {data.workingHour} Hours
							</p>
						</Col>
						<Col span={6}>
							<p>
								<TitleText>Payslip for:</TitleText>{" "}
								{/* {dayjs(data.salaryMonth, "M").format("MMMM")}, {data.salaryYear} */}
								{dayjs(String(data.salaryMonth), "M").format("MMM")}, {data.salaryYear}
								{/* {dayjs(data.salaryMonth).format("MM")} */}

							</p>
							<p>
								<TitleText>Created at:</TitleText>{" "}
								{dayjs(data.createdAt).format("DD/MM/YYYY")}
							</p>
							<p>
								<TitleText>Status:</TitleText> {data.paymentStatus}
							</p>
						</Col>
					</Row>

					<Row style={{ marginTop: "5%" }} gutter={[100, 0]}>
						{/* Earnings */}

						<Col span={12}>
							<h2 className='text-xl font-semibold text-slate-600 mb-4'>
								Earnings
							</h2>
							<Row>
								<Col span={12}>
									<Title level={5}>Salary Payable</Title>
								</Col>
								<Col
									span={12}
									style={{ display: "flex", justifyContent: "flex-end" }}>
									<Title level={5}>Rs. {data.salaryPayable}</Title>
								</Col>
							</Row>
							<Row>
								<Col span={12}>
									<Title level={5}>Bonus : {data.bonusComment}</Title>
								</Col>
								<Col
									span={12}
									style={{ display: "flex", justifyContent: "flex-end" }}>
									<Title level={5}>Rs. {data.bonus}</Title>
								</Col>
							</Row>

							<Divider></Divider>
							<Row>
								<Col span={12}>
									<Title level={4}>Total Earnings</Title>
								</Col>
								<Col
									span={12}
									style={{ display: "flex", justifyContent: "flex-end" }}>
									<Title level={5}>Rs. {data.salaryPayable + data.bonus}</Title>
								</Col>
							</Row>
						</Col>

						<Col span={12}>
							<h2 className='text-xl font-semibold text-slate-600 mb-4'>
								Deductions
							</h2>

							<Row>
								<Col span={12}>
									<Title level={5}>Deduction : {data.deductionComment}</Title>
								</Col>
								<Col
									span={12}
									style={{ display: "flex", justifyContent: "flex-end" }}>
									<Title level={5}>Rs. {data.deduction}</Title>
								</Col>
							</Row>

							<Divider style={{ marginTop: "40px" }}></Divider>
							<Row>
								<Col span={12}>
									<Title level={4}>Total Deduction</Title>
								</Col>
								<Col
									span={12}
									style={{ display: "flex", justifyContent: "flex-end" }}>
									<Title level={5}>Rs. {data.deduction}</Title>
								</Col>
							</Row>
						</Col>
					</Row>

					<div style={{ marginTop: "5%" }} className='flex justify-end'>
						<div>
							<Title level={4}>
								Total Earnings : Rs. {data.salaryPayable + data.bonus}{" "}
							</Title>
							<Title level={4}>Total Deduction : Rs. {data.deduction} </Title>
							<Title level={3}>
								Total Payable Salary : Rs. {data.totalPayable}{" "}
							</Title>
						</div>
					</div>
				</Col>
			</div>
		</Fragment>
	);
});

const DetailPayslip = () => {
	const componentRef = useRef();
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});

	const [invoiceData, setInvoiceData] = useState(null);
	useEffect(() => {
		getSetting().then((data) => setInvoiceData(data.result));
	}, []);

	const data = useSelector((state) => state.payroll?.payslip);
	const dispatch = useDispatch();
	const { id } = useParams("id");

	useEffect(() => {
		dispatch(loadSinglePayslip(id));

		return () => {
			dispatch(clearPayroll());
		};
	}, []);

	return (
		<div>
		{/* {console.log("InvoiceData: ", invoiceData)} */}
			<UserPrivateComponent permission={"readSingle-payroll"}>
				<div className=''>
					<div className='flex justify-end mr-10'>
						{invoiceData && (
							<Button type='primary' size='large' onClick={handlePrint}>
								Print Payslip
							</Button>
						)}
					</div>
					{data ? (
						<PrintToPdf
							ref={componentRef}
							data={data}
							invoiceData={invoiceData}
						/>
					) : (
						<Loader />
					)}
				</div>
			</UserPrivateComponent>
		</div>
	);
};

const TitleText = tw.span`
text-sm
font-semibold
text-slate-700

`;

const TitleText2 = tw.div`
text-sm
text-slate-600

`;
const TitleText3 = tw.span`
text-sm
text-slate-600

`;
export default DetailPayslip;
