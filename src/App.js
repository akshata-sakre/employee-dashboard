// ==========================
// IMPORTS
// ==========================
import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { employeeData } from "./data";

// Icons
import { FaSun, FaMoon } from "react-icons/fa";

// Charts
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

// Register AG Grid Modules
ModuleRegistry.registerModules([AllCommunityModule]);


// ==========================
// MAIN COMPONENT
// ==========================
function App() {

  // ==========================
  // STATE MANAGEMENT
  // ==========================
  const [searchText, setSearchText] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  // ==========================
  // DERIVED DATA
  // ==========================
  const departments = ["All", ...new Set(employeeData.map(emp => emp.department))];

  const filteredData =
    selectedDept === "All"
      ? employeeData
      : employeeData.filter(emp => emp.department === selectedDept);


  // ==========================
  // GRID COLUMN DEFINITIONS
  // ==========================
  const columnDefs = [
    { headerName: "ID", field: "id" },
    { headerName: "First Name", field: "firstName" },
    { headerName: "Last Name", field: "lastName" },
    { headerName: "Email", field: "email" },
    { headerName: "Department", field: "department" },
    { headerName: "Position", field: "position" },

    {
      headerName: "Salary",
      field: "salary",
      valueFormatter: (params) => `$${params.value.toLocaleString()}`
    },

    { headerName: "Location", field: "location" },

    {
      headerName: "Rating",
      field: "performanceRating",
      cellStyle: (params) => {
        if (params.value >= 4.5) {
          return { color: "green", fontWeight: "bold" };
        }
        return null;
      }
    },

    { headerName: "Projects", field: "projectsCompleted" },

    {
      headerName: "Status",
      field: "isActive",
      cellRenderer: (params) => (
        <span style={{
          padding: "5px 10px",
          borderRadius: "20px",
          color: "#fff",
          background: params.value ? "#22c55e" : "#ef4444",
          fontSize: "12px"
        }}>
          {params.value ? "Active" : "Inactive"}
        </span>
      )
    }
  ];


  // ==========================
  // SUMMARY CALCULATIONS
  // ==========================
  const totalEmployees = employeeData.length;

  const activeEmployees =
    employeeData.filter(emp => emp.isActive).length;

  const avgSalary = Math.round(
    employeeData.reduce((acc, emp) => acc + emp.salary, 0) / totalEmployees
  );


  // ==========================
  // CHART DATA
  // ==========================

  // Department Chart
  const deptData = Object.values(
    employeeData.reduce((acc, emp) => {
      acc[emp.department] =
        acc[emp.department] || { name: emp.department, count: 0 };
      acc[emp.department].count++;
      return acc;
    }, {})
  );

  // Status Chart
  const statusData = [
    { name: "Active", value: employeeData.filter(e => e.isActive).length },
    { name: "Inactive", value: employeeData.filter(e => !e.isActive).length }
  ];

  const COLORS = ["#22c55e", "#ef4444"];


  // ==========================
  // UI RENDER
  // ==========================
  return (
    <div style={{
      width: "95%",
      margin: "auto",
      marginTop: "20px",
      fontFamily: "Segoe UI, sans-serif",
      background: darkMode ? "#0f172a" : "#f8fafc",
      color: darkMode ? "#e2e8f0" : "#0f172a",
      padding: "20px",
      borderRadius: "12px",
      transition: "0.3s"
    }}>

      {/* ==========================
          HEADER
      ========================== */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <h1 style={{
          textAlign: "center",
          fontWeight: "700",
          fontSize: "28px",
          background: "linear-gradient(90deg, #6366f1, #06b6d4)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          marginBottom: "25px"
        }}>
          Employee Dashboard
        </h1>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "10px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            background: darkMode ? "#e2e8f0" : "#1e293b",
            color: darkMode ? "#000" : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>


      {/* ==========================
          SUMMARY CARDS
      ========================== */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "25px" }}>
        {[
          { title: "Total Employees", value: totalEmployees, color: "#6366f1" },
          { title: "Active Employees", value: activeEmployees, color: "#22c55e" },
          { title: "Avg Salary", value: `$${avgSalary}`, color: "#f59e0b" }
        ].map((card, index) => (
          <div key={index} style={{
            flex: 1,
            padding: "20px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #ffffff, #f1f5f9)",
            borderLeft: `5px solid ${card.color}`,
            boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
            transition: "0.3s",
            cursor: "pointer"
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <p style={{ color: "#64748b", fontSize: "14px" }}>{card.title}</p>
            <h2 style={{ color: card.color }}>{card.value}</h2>
          </div>
        ))}
      </div>


      {/* ==========================
          CONTROLS (FILTER + SEARCH)
      ========================== */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px"
      }}>
        <select
          onChange={(e) => setSelectedDept(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        >
          {departments.map((dept, index) => (
            <option key={index} value={dept}>{dept}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search employees..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            padding: "8px",
            width: "250px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />
      </div>


      {/* ==========================
          CHARTS SECTION
      ========================== */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>

        {/* Bar Chart */}
        <div style={{
          flex: 1,
          background: "#fff",
          padding: "15px",
          borderRadius: "16px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
        }}>
          <h3>Employees by Department</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deptData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={{
          flex: 1,
          background: "#fff",
          padding: "15px",
          borderRadius: "16px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
        }}>
          <h3>Employee Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>


      {/* ==========================
          DATA GRID
      ========================== */}
      <div className="ag-theme-alpine" style={{
        height: 500,
        borderRadius: "16px",
        overflow: "hidden",
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
      }}>
        <AgGridReact
          rowData={filteredData}
          columnDefs={columnDefs}
          quickFilterText={searchText}
          pagination={true}
          paginationPageSize={5}
          paginationPageSizeSelector={[5, 10, 20]}
          theme="legacy"
          defaultColDef={{
            sortable: true,
            filter: true,
            floatingFilter: true,
            resizable: true,
            cellStyle: { textAlign: "center" }
          }}
        />
      </div>

    </div>
  );
}

export default App;