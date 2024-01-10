import { Button, DatePicker, Form, Input, Space } from "antd";
import React from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const EmployeeEducationForm = ({ key, restField, remove, name }) => {
	return (
		<div>
			<Space
				key={key}
				style={{
					display: "flex",

					justifyContent: "space-between",
					marginBottom: 8,
				}}
				align='baseline'>
				<Form.Item
					{...restField}
					name={[name, "degree"]}
					rules={[
						{
							required: true,
							message: "Missing  degree",
						},
					]}>
					<Input placeholder='Degree' />
				</Form.Item>
				<Form.Item
					{...restField}
					name={[name, "institution"]}
					rules={[
						{
							required: true,
							message: "Missing institution",
						},
					]}>
					<Input placeholder='Institution' />
				</Form.Item>
				<Form.Item
					{...restField}
					name={[name, "result"]}
					rules={[{ required: true, message: "Missing result" }]}>
					<Input placeholder='Result' />
				</Form.Item>

				<Form.Item
					{...restField}
					name={[name, "startDate"]}
					rules={[{ required: true, message: "Missing startDate" }]}>
					<DatePicker placeholder='startDate' />
				</Form.Item>

				<Form.Item
					{...restField}
					name={[name, "endDate"]}
					rules={[{ required: true, message: "Missing endDate" }]}>
					<DatePicker placeholder='endDate' />
				</Form.Item>

				<Form.Item
					{...restField}
					name={[name, "fieldOfStudy"]}
					rules={[{ required: true, message: "Missing fieldOfStudy" }]}>
					<Input placeholder='Field Of Study; Computer' />
				</Form.Item>
				<MinusCircleOutlined
					className='txt-color'
					style={{ fontSize: "150%" }}
					onClick={() => remove(name)}
				/>
			</Space>
		</div>
	);
};

export default EmployeeEducationForm;
