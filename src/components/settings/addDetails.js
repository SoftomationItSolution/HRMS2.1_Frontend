import { Button, Card, Col, Form, Input, Row, Select, Typography } from "antd";
import { toast } from "react-toastify";
import getSetting from "../../api/getSettings";

import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import Loader from "../loader/loader";
import styles from "./AddDetails.module.css";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";

const addNewOffice = async (values) => {
  try {
    await axios({
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `setting/addOffice`,
      data: {
        ...values,
      },
    });
    return "success";
  } catch (error) {
    console.log(error.message);
  }
};

const updateInvoice = async (values, addNewOfficeFlag, initValues) => {
  try {
    if (addNewOfficeFlag) {
      return await addNewOffice(values);
    } else {
      console.log("values>> ", values);
      const selectedOfficeId = initValues.find(
        (setting) => setting.company_name === values.selectedOffice
      )?.id;

      if (selectedOfficeId) {
        await axios({
          method: "put",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
          url: `setting/${selectedOfficeId}`,
          data: {
            ...values,
          },
        });
        return "success";
      } else {
        console.error(
          "Selected office not found in initValues:",
          values.selectedOffice
        );
        return "error";
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

const AddDetails = () => {
  const { Title } = Typography;
  const { Option } = Select; // Destructure Option from Select

  const [loader, setLoader] = useState(false);
  const [form] = Form.useForm();
  const [initValues, setInitValues] = useState(null);
  const [isAddingNewOffice, setIsAddingNewOffice] = useState(false);
  const [officeNames, setOfficeNames] = useState([]); // State to store office names

  useEffect(() => {
    // Fetch office names when the component mounts
    getSetting().then((response) => {
      if (
        response &&
        response.result &&
        Array.isArray(response.result) &&
        response.result.length > 0
      ) {
        const officeNamesArray = response.result.map(
          (setting) => setting.company_name
        );
        setInitValues(response.result); // Set the first setting as initial values
        setOfficeNames(officeNamesArray);
      } else {
        console.error("Invalid data received from getSetting API:", response);
      }
    });
  }, []);

  const onFinish = async (values) => {
    try {
      if (isAddingNewOffice) {
        const resp = await addNewOffice(values);
        if (resp === "success") {
          toast.success("New Office Added Successfully");
          setInitValues({});
          // window.location.reload();
          setIsAddingNewOffice(false); // Reset the state after adding new office
        }
      } else {
        const resp = await updateInvoice(values, false);
        if (resp === "success") {
          toast.success("Office Details Updated Successfully");
          setInitValues({});
          // window.location.reload();
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    toast.error("Something went wrong !");
    console.log("Failed:", errorInfo);
  };

  const onClickLoading = async (values, addNewOfficeFlag) => {
    setLoader(true);
    try {
      // const resp = await updateInvoice(values, addNewOfficeFlag, initValues);
      const resp = await (addNewOfficeFlag
        ? addNewOffice(values)
        : updateInvoice(values, false, initValues));

      if (resp === "success") {
        toast.success(
          addNewOfficeFlag
            ? "New Office Added Successfully"
            : "Office Details Updated Successfully"
        );
        setInitValues({});
        setIsAddingNewOffice(false); // Reset the state after adding new office
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoader(false);
    }
  };

  // useEffect(() => {
  //   getSetting().then((data) => setInitValues(data.result));
  // }, []);

 const handleOfficeChange = (selectedOffice) => {
  if (selectedOffice === "addNew") {
    // Clear form fields when "Add New Office" is selected
    form.resetFields();
  } else {
    // Find the selected office in the array of settings
    const selectedSetting = initValues.find(
      (setting) => setting.company_name === selectedOffice
    );

    if (selectedSetting) {
      // Update the form fields with the selected setting based on id
      form.setFieldsValue(selectedSetting);
    }
  }
};


  return (
    <Fragment>
      <UserPrivateComponent permission={"create-setting"}>
        <Row className="mr-top" justify="center">
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={11}
            xl={11}
            className="border rounded column-design"
          >
            <Card bordered={false}>
              <Title level={4} className="m-2 mb-4 text-center">
                Company Setting
              </Title>
              {initValues ? (
                <Form
                  initialValues={{
                    ...initValues,
                  }}
                  form={form}
                  name="basic"
                  labelCol={{
                    span: 7,
                  }}
                  labelWrap
                  wrapperCol={{
                    span: 16,
                  }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  {/* Dropdown for selecting the office name */}
                  <Form.Item
                    style={{ marginBottom: "10px" }}
                    label="Select Office"
                    name="selectedOffice"
                  >
                    <Select
                      onChange={(selectedOffice) =>
                        handleOfficeChange(selectedOffice)
                      }
                    >
                      <Option value="addNew">Add New Office</Option>
                      {officeNames.map((officeName) => (
                        <Option key={officeName} value={officeName}>
                          {officeName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: "10px" }}
                    fields={[{ name: "Company Name" }]}
                    label="Company Name"
                    name="company_name"
                    rules={[
                      {
                        required: true,
                        message: "Please input Company name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    style={{ marginBottom: "10px" }}
                    fields={[{ name: "Tagline" }]}
                    label="Tagline"
                    name="tag_line"
                    rules={[
                      {
                        required: true,
                        message: "Please input Tagline!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: "10px" }}
                    label="Address"
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: "Please input Address!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: "10px" }}
                    label="Phone Number"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Please input Phone Number!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: "10px" }}
                    label="Email Address"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input Email Address!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: "10px" }}
                    label="Website"
                    name="website"
                    rules={[
                      {
                        required: true,
                        message: "Please input Website!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: "10px" }}
                    label="Footer"
                    name="footer"
                    rules={[
                      {
                        required: true,
                        message: "Please input Footer!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: "10px" }}
                    className={styles.addBtnContainer}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      shape="round"
                      size="large"
                      loading={loader}
                      onClick={() =>
                        onClickLoading(form.getFieldsValue(), true)
                      }
                    >
                      Add New Office
                    </Button>
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: "10px" }}
                    className={styles.addBtnContainer}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      shape="round"
                      size="large"
                      loading={loader}
                      onClick={() =>
                        onClickLoading(form.getFieldsValue(), false)
                      }
                    >
                      Update Office Details
                    </Button>
                  </Form.Item>
                </Form>
              ) : (
                <Loader />
              )}
            </Card>
          </Col>
        </Row>
      </UserPrivateComponent>
    </Fragment>
  );
};

export default AddDetails;
