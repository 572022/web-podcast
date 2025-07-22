import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  // Popconfirm,
  message,
  Space,
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  // DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Search } = Input;

const API = "https://podcastserver-production.up.railway.app/api/categories";
const TOKEN = localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: API,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `?search=${search}&page=${currentPage}&limit=${pageSize}`
      );
      setCategories(res.data.data || []);
    } catch (err) {
      message.error("Lỗi khi tải danh mục.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [search, currentPage]);

  const showModal = (category: any = null) => {
    setEditingCategory(category);
    if (category) {
      form.setFieldsValue({
        ten_danh_muc: category.ten_danh_muc,
        mo_ta: category.mo_ta,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCategory(null);
  };

  const onFinish = async (values: any) => {
    try {
      if (editingCategory) {
        await axiosInstance.put(`/${editingCategory.id}`, values);
        message.success("Cập nhật danh mục thành công.");
      } else {
        await axiosInstance.post(`/`, values);
        message.success("Tạo danh mục mới thành công.");
      }
      fetchCategories();
      handleCancel();
    } catch (err) {
      message.error("Lỗi khi lưu danh mục.");
    }
  };
  // const handleDelete = async (id: string) => {
  //   try {
  //     await axiosInstance.put(`/${id}/status`, { kich_hoat: false });
  //     message.success("Đã hủy kích hoạt danh mục.");
  //     fetchCategories();
  //   } catch (err) {
  //     message.error("Lỗi khi xóa danh mục.");
  //   }
  // };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "ten_danh_muc",
    },
    {
      title: "Mô tả",
      dataIndex: "mo_ta",
    },
    {
      title: "Trạng thái",
      dataIndex: "kich_hoat",
      render: (value: boolean, record: any) => (
        <Switch
          checked={value}
          onChange={(checked) =>
            axiosInstance
              .put(`/${record.id}/status`, { kich_hoat: checked })
              .then(() => {
                message.success("Đã cập nhật trạng thái");
                fetchCategories(); // load lại bảng để thấy mục đó vẫn hiển thị
              })
              .catch(() => message.error("Lỗi trạng thái"))
          }
        />
      ),
    },
    {
      title: "Hành động",
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          {/* <Popconfirm
            title="Xóa danh mục?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm> */}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Tìm kiếm danh mục..."
          enterButton={<SearchOutlined />}
          onSearch={(value) => setSearch(value)}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Thêm danh mục
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        loading={loading}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize,
          total: 10,
          onChange: (page) => setCurrentPage(page),
        }}
      />

      <Modal
        title={editingCategory ? "Chỉnh sửa danh mục" : "Tạo danh mục"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="ten_danh_muc"
            label="Tên danh mục"
            rules={[{ required: true, message: "Nhập tên danh mục" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mo_ta"
            label="Mô tả"
            rules={[{ required: true, message: "Nhập mô tả" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryList;
