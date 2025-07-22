import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";
import { useParams } from "react-router-dom";

interface Step {
  title: string;
  status: "done" | "processing" | "pending";
  timestamp: string | null;
}

const steps: Step[] = [
  {
    title: "Tải tài liệu lên hệ thống",
    status: "done",
    timestamp: "14/07/2025 09:00",
  },
  {
    title: "Phân tích nội dung",
    status: "processing",
    timestamp: "14/07/2025 09:10",
  },
  {
    title: "Tạo metadata",
    status: "pending",
    timestamp: null,
  },
  {
    title: "Xác nhận hoàn tất",
    status: "pending",
    timestamp: null,
  },
];

const getStatusIcon = (status: Step["status"]) => {
  switch (status) {
    case "done":
      return <FiCheckCircle className="text-green-500 text-xl" />;
    case "processing":
      return <FiClock className="text-yellow-500 animate-pulse text-xl" />;
    default:
      return <FiAlertCircle className="text-gray-400 text-xl" />;
  }
};

export default function DetailDocument() {
  const { id } = useParams();
  const [documentName, setDocumentName] = useState("slide-react.pdf");
  const [uploader, setUploader] = useState("Nguyễn Văn A");
  const [uploadDate, setUploadDate] = useState("14/07/2025");

  useEffect(() => {
    // TODO: Call API to fetch document details by id
    fetch(`/api/admin/documents/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setDocumentName(data.name);
        setUploader(data.uploader);
        setUploadDate(data.uploadDate);
      });
  }, [id]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Chi tiết xử lý tài liệu
      </h1>

      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <p><strong>Tài liệu:</strong> {documentName}</p>
        <p><strong>Người tải lên:</strong> {uploader}</p>
        <p><strong>Ngày tải lên:</strong> {uploadDate}</p>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-md border bg-gray-50 hover:bg-gray-100 transition"
          >
            <div>{getStatusIcon(step.status)}</div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{step.title}</p>
              <p className="text-sm text-gray-500">
                {step.timestamp ? `Thời gian: ${step.timestamp}` : "Chưa bắt đầu"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
