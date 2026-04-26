import React, { useEffect, useState } from "react";
import {
  getNoticesAPI,
  deleteNoticeAPI,
  addNoticeAPI,
} from "../../../../service/GlobalApi";



const tagColors = {
  New: "bg-blue-100 text-blue-600",
  Event: "bg-purple-100 text-purple-600",
  Update: "bg-slate-100 text-slate-600",
  Test: "bg-yellow-100 text-yellow-700",
};

function ParentNotice() {
    const [notices, setNotices] = useState([]);
    
    

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNoticesAPI();
        setNotices(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  

    return (
      <>
        

        <div className="p-3 grid md:grid-cols-2 gap-6">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="relative bg-white border border-slate-100 rounded-3xl p-6 shadow-md shadow-slate-100 
          hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              {/* Top Row */}
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${tagColors[notice.tag]}`}
                >
                  {notice.tag}
                </span>

                <span className="text-xs text-slate-400">{notice.date}</span>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-slate-800 leading-snug hover:text-blue-700 transition-colors">
                {notice.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-3">
                {notice.desc}
              </p>

              {/* Delete Button (Bottom Right) */}
              
            </div>
          ))}
        </div>
      </>
    );
}


export default ParentNotice
