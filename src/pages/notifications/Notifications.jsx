import { useEffect, useState } from "react";

import {
  getNotifications,
  getInvitations,
  respondToInvitation,
} from "../../services/notificationService";

import NotificationItem from "../../components/notifications/NotificationItem";
import NotificationTabs from "../../components/notifications/NotificationTabs";

import "./Notifications.css";


function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);


  /*
    IMPORTANT FOR TODAY'S DEMO

    Your membership mock data already contains:

    Pawani Jayakody
    pawani@example.com

    We use the currently logged-in demo user.

    Later, when real authentication is connected,
    replace this with the authenticated user's email.
  */
  const currentUserEmail = "pawani@example.com";


  useEffect(() => {

    const loadNotifications = async () => {

      try {

        // Load normal notifications
        const normalNotifications =
          await getNotifications();


        // Load workspace invitations
        const invitations =
          await getInvitations(currentUserEmail);


        console.log(
          "Invitations received:",
          invitations
        );


        // Convert invitations into notification objects
        const invitationNotifications =
          invitations
            .filter(
              (invitation) =>
                invitation.status === "pending"
            )
            .map((invitation) => ({

              id: `invitation-${invitation.id}`,

              type: "workspace_invitation",

              title: "Workspace Invitation",

              message:
                `${invitation.name} invited you to join workspace`,

              createdAt: "Just now",

              read: false,

              invitationId: invitation.id,

            }));


        // Put invitation notifications together
        // with the existing notifications
        setNotifications([
          ...invitationNotifications,
          ...normalNotifications,
        ]);

      } catch (error) {

        console.error(
          "Failed to load notifications:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    loadNotifications();

  }, []);


  // Mark notification as read
  const markAsRead = (notificationId) => {

    setNotifications(
      (currentNotifications) =>
        currentNotifications.map(
          (notification) =>
            notification.id === notificationId
              ? {
                  ...notification,
                  read: true,
                }
              : notification
        )
    );

  };


  // Accept / Decline invitation
  const handleInvitationResponse = async (
    invitationId,
    action
  ) => {

    try {

      await respondToInvitation(
        invitationId,
        action
      );


      // Remove invitation from screen
      setNotifications(
        (currentNotifications) =>
          currentNotifications.filter(
            (notification) =>
              notification.invitationId !==
              invitationId
          )
      );


      if (action === "accept") {

        alert(
          "Workspace invitation accepted successfully!"
        );

      } else {

        alert(
          "Workspace invitation declined."
        );

      }

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
          "Could not respond to invitation."
      );

    }

  };


  const displayedNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter(
          (notification) =>
            !notification.read
        );


  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;


  if (loading) {

    return (
      <div className="notifications-layout">

        <main className="notifications-main">

          <div className="notifications-page">

            <h1>Notifications</h1>

            <p>Loading notifications...</p>

          </div>

        </main>

      </div>
    );

  }


  return (
    <div className="notifications-layout">

      <main className="notifications-main">

        <div className="notifications-page">

          <div className="notifications-header">

            <h1>Notifications</h1>

            <p>
              Stay updated with everything happening
              in your workspaces
            </p>

          </div>


          <NotificationTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            totalCount={notifications.length}
            unreadCount={unreadCount}
          />


          <div className="notifications-list">

            {displayedNotifications.length === 0 ? (

              <p>No notifications</p>

            ) : (

              displayedNotifications.map(
                (notification) => (

                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onInvitationResponse={
                      handleInvitationResponse
                    }
                  />

                )
              )

            )}

          </div>

        </div>

      </main>

    </div>
  );
}


export default Notifications;