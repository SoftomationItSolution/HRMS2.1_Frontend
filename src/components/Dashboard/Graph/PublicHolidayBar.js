import { Avatar, List, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllPublicHoliday } from "../../../redux/rtk/features/publicHoliday/publicHolidaySlice";

const { Option } = Select;

const PublicHolidayBar = () => {
	const { list, loading } = useSelector((state) => state?.publicHoliday);
	const dispatch = useDispatch();
	const [filteredHolidays, setFilteredHolidays] = useState([]);
	const [selectedMonth, setSelectedMonth] = useState(dayjs().format("MM"));
	const [selectedYear, setSelectedYear] = useState(dayjs().format("YYYY"));

	useEffect(() => {
		dispatch(loadAllPublicHoliday());
	}, [dispatch]);

	useEffect(() => {
		// Parse and format dates from the list
		const formattedList = list.map((holiday) => ({
			...holiday,
			date: dayjs(holiday.date, "DD/MM/YYYY").format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
		}));

		// Filter holidays based on the selected month and year
		const selectedMonthYearHolidays = formattedList.filter(
			(holiday) =>
				dayjs(holiday.date).format("MM-YYYY") ===
				`${selectedMonth}-${selectedYear}`
		);

		setFilteredHolidays(selectedMonthYearHolidays);
	}, [list, selectedMonth, selectedYear]);

	const handleMonthChange = (value) => {
		setSelectedMonth(value);
	};

	const handleYearChange = (value) => {
		setSelectedYear(value);
	};

	return (
		<div>
			<Select
				value={selectedMonth}
				onChange={handleMonthChange}
				style={{ marginRight: 16, width: 120 }}
			>
				{Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
					<Option key={month} value={String(month).padStart(2, "0")}>
						{dayjs(`${month}`, "MM").format("MMMM")}
					</Option>
				))}
			</Select>

			<Select
				value={selectedYear}
				onChange={handleYearChange}
				style={{ marginRight: 16, width: 80 }}
			>
				{Array.from({ length: 10 }, (_, i) => i + dayjs().year()).map((year) => (
					<Option key={year} value={String(year)}>
						{year}
					</Option>
				))}
			</Select>

			<List
				loading={loading}
				itemLayout='horizontal'
				dataSource={filteredHolidays}
				renderItem={(item, index) => (
					<List.Item>
						<List.Item.Meta
							avatar={
								<div
									style={{ height: "65px", width: "60px" }}
									className='border-4 border-indigo-500/75 text-center'>
									<h3 className='text-xl font-medium txt-color-2'>
										{dayjs(item.date).format("DD")}
									</h3>
									<h3 className='text-base font-medium txt-color-secondary '>
										{dayjs(item.date).format("MMM")}
									</h3>
								</div>
							}
							title={
								<h3 className='text-base font-medium ml-4'>{item.name}</h3>
							}
							description={
								<div className='flex items-center'>
									<p className='text-sm text-gray-500 ml-4'>
										{dayjs(item.date).format("DD/MM/YYYY")}
									</p>
								</div>
							}
						/>
					</List.Item>
				)}
			/>
		</div>
	);
};

export default PublicHolidayBar;
