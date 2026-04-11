import React, { useEffect, useState } from "react";
import { deleteStudent, getStudents } from "../../../../service/GlobalApi";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider } from "ag-grid-react";
import { toast } from "sonner";
const modules = [AllCommunityModule];

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AddStudent from "./AddStudent";
import { Button } from "@/components/ui/button";
import { Search, Trash } from "lucide-react";

const paginationPageSizeSelector = 1200;

function ViewStudentDetails() {
  const [studentList, setStudentList] = useState([]);
  const [rowData, setRowData] = useState();
  const [showTable, setShowTable] = useState(false);


  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);

      toast.success("Student deleted ✅");

      // refresh list
      await fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed ❌");
    }
  };

  const CustomButtons = (props) => {
    if (!props?.data) return null;

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <span>
            <Button variant="ghost" size="icon">
              <Trash className="w-4 h-4 text-red-500" />
            </Button>
          </span>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the student.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await handleDelete(props.data.id);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const [colDefs] = useState([
    { field: "rollnumber", filter: true },
    { field: "name", filter: true },
    { field: "phone", filter: true },
    { field: "parent_phone", filter: true },
    { field: "batch", filter: true },
    { field: "sectionn", filter: true },
    { field: "action", cellRenderer: CustomButtons },
  ]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await getStudents();
      setStudentList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setRowData(studentList);
  }, [studentList]);

  const [searchInput, setSearchInput] = useState();

  return (
    <div>
      <div className="flex justify-between m-4">
        <h2 className="text-xl font-bold">All students Details</h2>
        <AddStudent />
      </div>
      <AgGridProvider modules={modules}>
        {/* Data Grid will fill the size of the parent container */}
        <div style={{ height: 540 }}>
          <div className="p-2 rounded-lg border shadow-sm flex gap-2 mb-4 max-w-sm">
            <Search />
            <input
              type="text"
              placeholder="Search on Anything..."
              className="outline-none w-full"
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
          <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            rowHeight={40}
            headerHeight={45}
            quickFilterText={searchInput}
          />
        </div>
      </AgGridProvider>
    </div>
  );
}

export default ViewStudentDetails;
