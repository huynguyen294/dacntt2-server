const users = [
  {
    name: "Nguyễn Văn A",
    email: "vana1@gmail.com",
    password: "Pass1234",
    role: "student",
    date_of_birth: "2000-04-29",
    phone_number: "0978000001",
    address: "Quận 1, Thành Phố HCM",
  },
  {
    name: "Trần Thị B",
    email: "thib2@gmail.com",
    password: "1234abcd",
    role: "student",
    date_of_birth: "2001-06-15",
    phone_number: "0978000002",
    address: "Quận 2, Thành Phố HCM",
  },
  {
    name: "Lê Minh C",
    email: "minhc3@gmail.com",
    password: "Cpass456",
    role: "student",
    date_of_birth: "1999-11-22",
    phone_number: "0978000003",
    address: "Quận 3, Thành Phố HCM",
  },
  {
    name: "Phạm Thảo D",
    email: "thaod4@gmail.com",
    password: "Thaod789",
    role: "student",
    date_of_birth: "2000-01-05",
    phone_number: "0978000004",
    address: "Quận 4, Thành Phố HCM",
  },
  {
    name: "Đỗ Quang E",
    email: "quange5@gmail.com",
    password: "Doquang99",
    role: "student",
    date_of_birth: "2002-12-10",
    phone_number: "0978000005",
    address: "Quận 5, Thành Phố HCM",
  },
  {
    name: "Võ Nhật F",
    email: "nhatf6@gmail.com",
    password: "VoFnhat",
    role: "student",
    date_of_birth: "1998-07-17",
    phone_number: "0978000006",
    address: "Quận 6, Thành Phố HCM",
  },
  {
    name: "Huỳnh Mai G",
    email: "maig7@gmail.com",
    password: "MaiG123",
    role: "student",
    date_of_birth: "2000-09-09",
    phone_number: "0978000007",
    address: "Quận 7, Thành Phố HCM",
  },
  {
    name: "Ngô Anh H",
    email: "anhh8@gmail.com",
    password: "NgoAnh89",
    role: "student",
    date_of_birth: "2001-03-30",
    phone_number: "0978000008",
    address: "Quận 8, Thành Phố HCM",
  },
  {
    name: "Bùi Kim I",
    email: "kimi9@gmail.com",
    password: "Buikim12",
    role: "student",
    date_of_birth: "1997-08-08",
    phone_number: "0978000009",
    address: "Quận 9, Thành Phố HCM",
  },
  {
    name: "Cao Hữu J",
    email: "huuj10@gmail.com",
    password: "Caojpass",
    role: "student",
    date_of_birth: "2003-10-20",
    phone_number: "0978000010",
    address: "Quận 10, Thành Phố HCM",
  },

  // 90 người tiếp theo sẽ được tạo tự động theo mẫu

  ...Array.from({ length: 90 }, (_, i) => ({
    name: `Nguyễn Văn ${String.fromCharCode(75 + i)}`,
    email: `user${i + 11}@gmail.com`,
    password: `Pass${1000 + i}`,
    role: "student",
    date_of_birth: `200${Math.floor(Math.random() * 5)}-${String(Math.floor(Math.random() * 12 + 1)).padStart(
      2,
      "0"
    )}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, "0")}`,
    phone_number: `0978000${(i + 11).toString().padStart(3, "0")}`,
    address: `Quận ${Math.floor(Math.random() * 12 + 1)}, Thành Phố HCM`,
  })),
];

const generateDummyUser = () => {
  //   console.log(users);
};

export default generateDummyUser;
