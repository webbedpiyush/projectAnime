/* eslint-disable react/prop-types */
export const Tab = ({ title, isActive, onClick, children }) => (
  <div
    title={title}
    onClick={onClick}
    className={`cursor-pointer font-bold relative overflow-hidden transition duration-300 ease-in-out p-4 text-sm rounded-[0.3rem] ${
      isActive ? "bg-[#8080cf]" : "bg-transparent"
    } hover:bg-[#8080cf] active:bg-[#8080cf] focus:bg-[#8080cf]`}
  >
    {children}
  </div>
);
