import React, { useState, useEffect } from "react";
import { Card, Avatar, Tag, Col, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { nominationFallback } from "../lib/nominationFallback";

// Example of your response structure
const getStatusColor = (status) => {
  switch (status) {
    case 0: // DRAFT (Nominator)
      return "gray";
    case 1: // NOMINATED (Nominator, Nominee) - When Submit button is clicked
      return "gold";
    case 2: // NOMINEE REVIEW - Status changes when Nominee accepts the nomination
      return "blue";
    case 3: // WITNESS REVIEW
      return "purple";
    case 4: // REJECTED BY NOMINEE
      return "red";
    case 5: // CANCEL - iKarma Admin or HR Partnered with iKarma
      return "red";
    case 6: // WITHDRAW - Nominator
      return "lightgray";
    case 7: // HR REVIEWED (edited)
      return "cyan";
    case 8: // COMPLETED
      return "green";
    default:
      return "gray";
  }
};

const RecentNominations = () => {
  const [nominations, setNominations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNominations = async () => {
      try {
        const response = await axios.get(
          "https://umbznza169.execute-api.us-east-2.amazonaws.com/hr/home/list/company_id?pageSize=1&pageNumber=1",
          {
            headers: {
              Authorization: `Bearer ${process.env.TOKEN}`,
            },
          }
        );
        // Map the nominations data from response
        setNominations(response.data.data.nominationData || []);
      } catch (error) {
        console.error("Error fetching nominations:", error);
        setNominations(nominationFallback.data.nominationData || []);
      } finally {
        setLoading(false);
      }
    };

    fetchNominations();
  }, []);

  if (loading) {
    return <Spin size="large" />;
  }

      // Filter nominations with status === 7
      const filteredNominations = nominations.filter((nomination) => nomination.status >= 7);

  return (
    <>
      <p className="heading">Recent Nominations</p>
      <Col className="custom-content-area col">
        {filteredNominations.map((nomination, index) => (
          <Card
            key={nomination.id}
            style={{
              minWidth: 350,
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
            bodyStyle={{ padding: "16px" }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                size={48}
                icon={<UserOutlined />}
                src={nomination.imgurl || "/user.jpg"} // Use image from the nomination data
                style={{ marginRight: "16px" }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: "16px" }}>
                  {nomination.name}
                </h3>
                <div style={{ fontSize: "14px", color: "#555" }}>
                  By: {nomination.nominatedby}
                </div>
                <div style={{ fontSize: "14px", color: "#555" }}>
                  For: {nomination.name}
                </div>
                <div style={{ fontSize: "12px", color: "#999" }}>
                  {new Date(nomination.created_date).toLocaleDateString()}
                </div>
              </div>
            </div>
            <Tag
  color={getStatusColor(nomination.status)}
  style={{
    position: "absolute",
    top: "16px",
    right: "16px",
    fontSize: "12px",
    borderRadius: "8px",
  }}
>
  {nomination.status === 0
    ? "Draft"
    : nomination.status === 1
    ? "Nominated"
    : nomination.status === 2
    ? "Nominee Review"
    : nomination.status === 3
    ? "Witness Review"
    : nomination.status === 4
    ? "Rejected by Nominee"
    : nomination.status === 5
    ? "Cancelled"
    : nomination.status === 6
    ? "Withdrawn"
    : nomination.status === 7
    ? "HR Reviewed"
    : nomination.status === 8
    ? "Completed"
    : "Unknown Status"}
</Tag>

          </Card>
        ))}
      </Col>
    </>
  );
};

export default RecentNominations;
