// server/src/app/student/student.test.ts
import request from "supertest";
import { prisma } from "../../utils/configs";
import { createApp } from "..";

jest.mock("../../utils/configs", () => ({
  prisma: {
    student: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    parent: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    studentParent: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

const app = createApp();

describe("Student Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /v1/api/student", () => {
    it("should create a new student", async () => {
      const mockStudent = { id: "1", name: "John Doe" };
      (prisma.student.create as jest.Mock).mockResolvedValue(mockStudent);

      const response = await request(app).post("/v1/api/student").send({
        name: "John Doe",
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockStudent);
    });
  });

  describe("POST /v1/api/student/parent", () => {
    it("should create a new student-parent relation", async () => {
      const mockStudent = { id: "1", name: "John Doe" };
      const mockParent = { id: "2", name: "Jane Doe" };
      const mockStudentParent = { id: "1", studentId: "1", parentId: "2" };
      (prisma.student.findUnique as jest.Mock).mockResolvedValue(mockStudent);
      (prisma.parent.findUnique as jest.Mock).mockResolvedValue(mockParent);
      (prisma.parent.create as jest.Mock).mockResolvedValue(mockStudentParent);

      const response = await request(app).post("/v1/api/student/parent").send({
        studentId: "1",
        parentId: "2",
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockStudentParent);
    });
  });

  describe("GET /v1/api/student/:id", () => {
    it("should get a student by id", async () => {
      const mockStudent = { id: "1", name: "John Doe" };
      (prisma.student.findUnique as jest.Mock).mockResolvedValue(mockStudent);

      const response = await request(app).get("/v1/api/student/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStudent);
    });
  });

  describe("GET /v1/api/student/:id/parent", () => {
    it("should get a student-parent relation by student id", async () => {
      const mockStudent = { id: "1", name: "John Doe" };
      const mockParent = { id: "2", name: "Jane Doe" };
      const mockStudentParent = { id: "1", studentId: "1", parentId: "2" };
      (prisma.student.findUnique as jest.Mock).mockResolvedValue(mockStudent);
      (prisma.parent.findUnique as jest.Mock).mockResolvedValue(mockParent);
      (prisma.parent.findUnique as jest.Mock).mockResolvedValue(mockStudentParent);

      const response = await request(app).get("/v1/api/student/1/parent");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStudentParent);
    });
  });
});
