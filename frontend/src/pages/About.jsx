import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import LandingLayout from "../components/landing/LandingLayout";
import ProductTourPreview from "../components/landing/ProductTourPreview";

const tourSections = [
  {
    id: "overview", title: "Tổng quan",
    headline: "Làm quen với không gian học tập.",
    description: "Sau khi đăng nhập, bạn đến Dashboard. Thanh điều hướng bên trái giúp chuyển giữa môn học, deadline, lịch học, tài liệu và thống kê; trên điện thoại, mở menu để chọn khu vực cần dùng.",
    details: [
      "Bắt đầu ở Môn học: thêm các môn đang học để gắn công việc, lịch và tài liệu vào đúng môn.",
      "Ghi kế hoạch trong Deadline và Lịch học, rồi cập nhật khi có thay đổi.",
      "Trở lại Dashboard để xem phần đã hoàn thành và các hạn nộp cần chú ý.",
    ],
  },
  {
    id: "dashboard", title: "Dashboard",
    headline: "Nhìn nhanh tiến độ trước khi bắt đầu.",
    description: "Màn hình tổng quan tập hợp số liệu từ các môn học và deadline bạn đã lưu. Bạn có thể nhìn phần việc còn lại, số deadline quá hạn và số đến hạn trong 7 ngày tới.",
    details: [
      "Xem tổng số môn, deadline, công việc đã hoàn thành và chưa hoàn thành.",
      "Đọc tỷ lệ hoàn thành cùng số deadline quá hạn hoặc sắp tới.",
      "Dùng Truy cập nhanh để chuyển tới thêm môn, tạo deadline, xếp lịch hoặc thêm tài liệu.",
    ],
  },
  {
    id: "subjects", title: "Môn học",
    headline: "Mỗi môn có một chỗ để lưu thông tin.",
    description: "Các môn được trình bày thành thẻ, với mã môn, tên, tín chỉ, giảng viên và mô tả. Đây là danh sách bạn dùng khi tạo deadline, lịch học hoặc tài liệu.",
    details: [
      "Chọn Thêm môn học và nhập tên, mã môn, tín chỉ, giảng viên cùng mô tả.",
      "Tìm nhanh bằng tên môn, mã môn hoặc giảng viên ở ô tìm kiếm.",
      "Chọn Sửa trên từng thẻ để cập nhật thông tin; Xóa sẽ yêu cầu xác nhận.",
    ],
  },
  {
    id: "tasks", title: "Nhiệm vụ",
    headline: "Biết việc cần làm và hạn cần giữ.",
    description: "Khu vực này có tên Deadline trong ứng dụng. Mỗi công việc gắn với một môn học, có hạn nộp, mức ưu tiên, trạng thái và ghi chú để bạn theo dõi đến khi hoàn thành.",
    details: [
      "Chọn Thêm deadline để ghi công việc mới và chọn môn tương ứng.",
      "Lọc theo trạng thái hoặc mức ưu tiên; xem số deadline quá hạn, sắp tới và đã hoàn thành.",
      "Chọn Hoàn thành trên thẻ khi xử lý xong; dùng Sửa để điều chỉnh hạn nộp và thông tin.",
    ],
  },
  {
    id: "schedule", title: "Lịch học",
    headline: "Xem tuần học theo thứ và tiết.",
    description: "Thời khóa biểu đặt các buổi học vào bảng tuần. Mỗi buổi hiển thị môn học, tiết và phòng, giúp bạn tra lại kế hoạch lên lớp trong cùng một màn hình.",
    details: [
      "Chọn Thêm lịch học, rồi nhập môn, thứ, tiết bắt đầu, tiết kết thúc và phòng học.",
      "Lọc theo môn để xem các buổi thuộc môn cần tìm.",
      "Nhấp một buổi trên lịch để chỉnh sửa; có thể xóa buổi học khi kế hoạch thay đổi.",
    ],
  },
  {
    id: "documents", title: "Tài liệu",
    headline: "Tìm lại bài giảng theo đúng môn.",
    description: "Kho tài liệu hiển thị tên tài liệu, loại file, môn học và thông tin file. Trạng thái trên thẻ phân biệt tài liệu đã tải file lên với tài liệu chỉ lưu thông tin.",
    details: [
      "Chọn Thêm tài liệu để lưu thông tin hoặc tải lên file PDF, Word, PowerPoint hay ảnh, tối đa 10 MB.",
      "Tìm bằng tên tài liệu, tên file, loại file hoặc môn học; kết hợp bộ lọc môn để thu hẹp danh sách.",
      "Chọn Mở file trên tài liệu đã tải lên để xem trong trang riêng; Sửa để cập nhật thông tin.",
    ],
  },
];

function About() {
  const { hash } = useLocation();
  const selectedSection = tourSections.find((section) => "#" + section.id === hash) || tourSections[0];
  const activeSection = selectedSection.id;
  const navigationRef = useRef(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Chi tiết về web | Study Manager";
    return () => { document.title = previousTitle; };
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 1024) return;
    const navigation = navigationRef.current;
    const activeLink = navigation?.querySelector('[aria-current="location"]');
    if (!navigation || !activeLink) return;

    const navigationBounds = navigation.getBoundingClientRect();
    const linkBounds = activeLink.getBoundingClientRect();
    if (linkBounds.left < navigationBounds.left || linkBounds.right > navigationBounds.right) {
      navigation.scrollBy({ left: linkBounds.left - navigationBounds.left - (navigation.clientWidth - activeLink.offsetWidth) / 2 });
    }
  }, [activeSection]);

  return (
    <LandingLayout>
      <main id={activeSection} aria-labelledby="about-title" className="landing-tour mx-auto grid w-full max-w-[1440px] gap-5 px-5 py-6 sm:px-8 lg:gap-4 lg:py-4">
        <header className="border-b border-blue-100 pb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2f689f]">Chi tiết về web</p>
          <h1 id="about-title" className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#123552] sm:text-3xl">Tham quan Study Manager.</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Quản lý môn học, deadline, lịch và tài liệu. Chọn một khu vực để khám phá cách dùng.</p>
        </header>

        <div className="grid min-h-0 min-w-0 gap-4 lg:grid-cols-[176px_minmax(0,1fr)]">
          <aside aria-label="Mục lục tham quan" className="min-h-0 rounded-2xl border border-blue-100 bg-[#fafdff] p-2 lg:overflow-y-auto">
            <p className="hidden px-3 pb-3 pt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 lg:block">Khám phá giao diện</p>
            <nav ref={navigationRef} aria-label="Các khu vực Study Manager" className="flex gap-1 overflow-x-auto lg:flex-col">
              {tourSections.map((section, index) => (
                <Link key={section.id} to={{ hash: "#" + section.id }} aria-controls="tour-panel" aria-current={activeSection === section.id ? "location" : undefined} className={"flex min-h-10 shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-blue-300 " + (activeSection === section.id ? "bg-[#e6f2ff] text-[#2f689f]" : "text-slate-600 hover:bg-blue-50 hover:text-[#3979c2]")}>
                  <span aria-hidden="true" className="text-[10px] opacity-70">{String(index + 1).padStart(2, "0")}</span>{section.title}
                </Link>
              ))}
            </nav>
          </aside>

          <section key={activeSection} id="tour-panel" tabIndex={0} aria-labelledby={activeSection + "-title"} className="min-h-0 min-w-0 rounded-2xl border border-blue-100 bg-[#f8fbff] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 lg:overflow-y-auto">
            <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[240px_minmax(0,1fr)]">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#2f689f]">{String(tourSections.indexOf(selectedSection) + 1).padStart(2, "0")} / {selectedSection.title}</p>
                <h2 id={activeSection + "-title"} className="mt-2 text-xl font-black tracking-[-0.035em] text-[#123552]">{selectedSection.headline}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{selectedSection.description}</p>
                <ul className="mt-4 space-y-2 text-xs leading-5 text-slate-600">
                  {selectedSection.details.map((detail) => <li key={detail} className="flex items-start gap-2"><span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#4f8edc]" />{detail}</li>)}
                </ul>
              </div>
              <div className="min-w-0">
                <ProductTourPreview screen={activeSection} title={selectedSection.title} />
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-3 border-t border-blue-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-[#123552]">Bắt đầu với môn học đầu tiên của bạn.</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/register" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#4f8edc] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#3979c2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300">Đăng ký</Link>
            <Link to="/login" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-bold text-[#2f689f] transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300">Đăng nhập</Link>
          </div>
        </div>
      </main>
    </LandingLayout>
  );
}

export default About;
