import { Popover } from "antd";
import { useState } from "react";
import { FiArrowDown } from "react-icons/fi";

const Select = ({ options, onChange }) => {
  const [selected, setSelected] = useState(options[0]); // Lựa chọn mặc định
  const [isOpen, setIsOpen] = useState(false); // Trạng thái mở/đóng của menu

  const handleSelect = (option) => {
    setSelected(option); // Cập nhật lựa chọn
    console.log(option.value,'otion')
    onChange(option.value); // Gọi hàm onChange với lựa chọn mới
    setIsOpen(false); // Đóng menu sau khi chọn
  };

  return (
    <div className="relative inline-block">
      <button
        className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 border rounded"
        onClick={() => setIsOpen(!isOpen)} // Bật/tắt menu khi nhấp
      >
        <span className="flex items-center">{selected.icon}</span>
        <span>
          <FiArrowDown />
        </span>
      </button>
      {isOpen && (
        <ul className="absolute left-0 w-full mt-1 bg-white border rounded shadow-lg">
          {options.map((option) => (
            <Popover trigger={'hover'} content={option.name}>
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {option.icon}
              </li>
            </Popover>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
