import React, { useState, useEffect } from "react";
import { Modal, Spin, Form, Input, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Tree, Button } from "antd";
import {
  addDepartment,
  getDepartmentHierarchy,
  updateDepartmentHierarchy,
} from "./network/lib/department_hierarchy";
import FormatToTree from "./helpers/formatData";
import "./App.css";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [treeContent, setTreeContent] = useState([]);
  const [networkResponse, setNetworkResponse] = useState([]);
  const [modalContent, setModalContent] = useState([]);
  const [clickedId, setClickedId] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    (async () => await fetchDepartmentHierarchy())();
  }, []);
  const fetchDepartmentHierarchy = async () => {
    await getDepartmentHierarchy().then((res) => {
      setTreeContent([FormatToTree(res.data, "CEO")]);
      setNetworkResponse(res.data);
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setAdding(false);
    setEdit(false);
    setModalContent([]);
  };

  const onSelect = (key, info) => {
    setModalContent(info.selectedNodes);
    setClickedId(info.selectedNodes[0]?.id);
    showModal();
  };

  const handleEdit = () => {
    setEdit(!edit);
  };

  const onFinish = async (values) => {
    setSaving(true);
    const payload = {
      ID: "id",
      id: !adding ? clickedId : values.new_title,
      Name: !adding ? values.title : values.new_title,
      description: !adding ? values.description : values.new_description,
      managing_department: !adding
        ? values.managing_department
        : values.new_managing_department,
    };

    console.log(payload);

    let res = !adding
      ? await updateDepartmentHierarchy(clickedId, JSON.stringify(payload))
      : await addDepartment(payload);
    if (res) {
      await fetchDepartmentHierarchy();
      setSaving(false);
      setIsModalOpen(false);
      setEdit(false);
      setAdding(false);
      message.success("Operation successful!");
    } else {
      setSaving(false);
      setIsModalOpen(false);
      setEdit(false);
      setAdding(false);
      message.error("Operation faled!");
    }
  };
  const handleAdd = () => {
    setEdit(true);
    setIsModalOpen(true);
    setAdding(true);
  };
  console.log(modalContent.length !== 0);

  return (
    <div>
      {treeContent.length ? (
        <div
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "50px",
          }}
        >
          <Button style={{ width: "50%" }} onClick={handleAdd}>
            Add
          </Button>
          <Tree
            showLine
            switcherIcon={<DownOutlined />}
            defaultExpandedKeys={["0-0-0"]}
            onSelect={onSelect}
            treeData={treeContent}
          />
        </div>
      ) : (
        <div
          style={{ width: "fit-content", margin: "auto", marginTop: "100px" }}
        >
          <Spin />
        </div>
      )}

      <Modal
        title="Department Info"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          edit
            ? []
            : [
                <Button key="back" onClick={handleCancel}>
                  Return
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  // loading={loading}
                  onClick={handleEdit}
                >
                  Edit
                </Button>,
              ]
        }
      >
        {edit ? (
          saving ? (
            <div
              style={{
                width: "fit-content",
                margin: "auto",
                marginTop: "50px",
              }}
            >
              <Spin />
            </div>
          ) : (
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              initialValues={
                modalContent.length !== 0
                  ? {
                      title:
                        modalContent.length !== 0 ? modalContent[0].title : "",
                      description: modalContent[0]?.description,
                      managing_department: modalContent[0]?.managing_department,
                    }
                  : {}
              }
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Department Name"
                name={adding ? "new_title" : "title"}
                rules={[
                  {
                    required: true,
                    message: "Please input title!",
                  },
                  {
                    min: 3,
                    message: "Department Name must be minimum 3 characters.",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Description"
                name={adding ? "new_description" : "description"}
                rules={[
                  {
                    required: true,
                    message: "Please input description!",
                  },
                  {
                    min: 3,
                    message: "Description must be minimum 3 characters.",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Managing Department"
                name={
                  adding ? "new_managing_department" : "managing_department"
                }
                rules={[
                  {
                    required: true,
                    message: "Please input managing department!",
                  },
                  {
                    min: 3,
                    message:
                      "Managing Department Name must be minimum 3 characters.",
                  },
                ]}
              >
                <Input style={{ marginLeft: "10px" }} />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button
                  style={{ marginLeft: "5px" }}
                  key="back"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          )
        ) : (
          <ul>
            <li>Department Name: {modalContent[0]?.title}</li>
            <li>Description: {modalContent[0]?.description}</li>
            <li>
              Managing Department:{" "}
              {modalContent[0]?.managing_department !== modalContent[0]?.title
                ? modalContent[0]?.managing_department
                : "None"}
            </li>
            <li>
              Department(s) Under its Management:{" "}
              {modalContent[0]?.children?.length ? (
                <ul>
                  {modalContent[0]?.children?.map((child) => {
                    return <li>{child?.title}</li>;
                  })}
                </ul>
              ) : (
                "None"
              )}
            </li>
          </ul>
        )}
      </Modal>
    </div>
  );
};

export default App;
