export type ContactStatus = "available" | "busy" | "urgent-calls-only";

export type Contact = {
  uuid: string;
  name: string;
  avatar: string;
  alreadyHadChat: boolean;
  status: ContactStatus;
};

export const contacts: Contact[] = [
  {
    uuid: "c1a9f8b2-1a23-4f4a-9e11-01a2b3c4d5e1",
    name: "Rahul Sharma",
    avatar: "https://i.pravatar.cc/150?img=1",
    alreadyHadChat: true,
    status: "available",
  },
  {
    uuid: "c2b7e9d4-2b34-4d9c-8a21-12b3c4d5e6f2",
    name: "Priya Patel",
    avatar: "https://i.pravatar.cc/150?img=5",
    alreadyHadChat: true,
    status: "busy",
  },
  {
    uuid: "c3d8f6a1-3c45-4eab-7b31-23c4d5e6f7a3",
    name: "Arjun Reddy",
    avatar: "https://i.pravatar.cc/150?img=10",
    alreadyHadChat: false,
    status: "urgent-calls-only",
  },
  {
    uuid: "c4e7a5b9-4d56-4fbc-6c41-34d5e6f7a8b4",
    name: "Sneha Iyer",
    avatar: "https://i.pravatar.cc/150?img=8",
    alreadyHadChat: true,
    status: "available",
  },
  {
    uuid: "c5f6b4a8-5e67-4acd-5d51-45e6f7a8b9c5",
    name: "Vikram Singh",
    avatar: "https://i.pravatar.cc/150?img=12",
    alreadyHadChat: false,
    status: "busy",
  },
  {
    uuid: "c6a5c3d7-6f78-4bde-4e61-56f7a8b9c0d6",
    name: "Ananya Gupta",
    avatar: "https://i.pravatar.cc/150?img=15",
    alreadyHadChat: true,
    status: "urgent-calls-only",
  },
  {
    uuid: "c7b4d2e6-7a89-4cef-3f71-67a8b9c0d1e7",
    name: "Karthik",
    avatar: "https://i.pravatar.cc/150?img=20",
    alreadyHadChat: false,
    status: "available",
  },
  {
    uuid: "c8c3e1f5-8b90-4df0-2a81-78b9c0d1e2f8",
    name: "Neha Verma",
    avatar: "https://i.pravatar.cc/150?img=25",
    alreadyHadChat: true,
    status: "busy",
  },
];
