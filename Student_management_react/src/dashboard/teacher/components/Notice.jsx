import React, { useEffect, useState } from "react";
import {
  getNoticesAPI,
  deleteNoticeAPI,
  addNoticeAPI,
} from "../../../../service/GlobalApi";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus } from "lucide-react";


const tagColors = {
  New: "bg-blue-100 text-blue-600",
  Event: "bg-purple-100 text-purple-600",
  Update: "bg-slate-100 text-slate-600",
  Test: "bg-yellow-100 text-yellow-700",
};

function Notice() {
    const [notices, setNotices] = useState([]);
    const [form, setForm] = useState({
      title: "",
      content: "",
      tag: "Update",
    });
    const handleAddNotice = async () => {
      if (!form.title || !form.content) return;

      const res = await addNoticeAPI(form);

      // add to UI instantly
      const newNotice = {
        id: res.id,
        title: res.title,
        desc: res.content,
        tag: res.tag,
        date: new Date(res.created_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      };

      setNotices((prev) => [newNotice, ...prev]);

      // reset form
      setForm({ title: "", content: "", tag: "Update" });
    };

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this notice?");
    if (!confirmDelete) return;

    await deleteNoticeAPI(id);
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

    return (
      <>
        <div className="flex justify-start p-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="flex items-center gap-2 p4">
                <Plus size={16} />
                Add Notice
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 space-y-4">
              <h3 className="font-semibold text-sm">Create Notice</h3>

              {/* Title */}
              <Input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              {/* Content */}
              <Textarea
                placeholder="Content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />

              {/* Tag Select */}
              <Select
                value={form.tag}
                onValueChange={(value) => setForm({ ...form, tag: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Update">Update</SelectItem>
                  <SelectItem value="Test">Test</SelectItem>
                </SelectContent>
              </Select>

              {/* Submit */}
              <Button onClick={handleAddNotice} className="w-full">
                Add Notice
              </Button>
            </PopoverContent>
          </Popover>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-6">
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
              <div className="absolute bottom-4 right-4">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(notice.id)}
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
}

export default Notice;
