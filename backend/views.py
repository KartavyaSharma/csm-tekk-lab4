from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.schemas.coreapi import serializers

from backend.models import User, Section, Student, Attendance
from backend.serializers import (
    AttendanceSerializer,
    UserSerializer,
    StudentSerializer,
    MentorSerializer,
    SectionSerializer,
    CourseSerializer,
)


@api_view(["GET"])
def users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
def sections(request):
    sections = Section.objects.all()
    serializer = SectionSerializer(sections, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
def section_students(request, section_id):
    section = Section.objects.get(id=section_id)
    students = section.student_set.filter(active=True)
    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET", "POST"])
def section_details(request, section_id):
    """
    GET: Return section details
    POST: Update section details
        - format: { "capacity": int, "description": str }
    """
    if request.method == "GET":
        section = Section.objects.get(id=section_id)
        serializer = SectionSerializer(section)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == "POST":
        section = Section.objects.get(id=section_id)
        capacity = request.data.get("capacity")
        description = request.data.get("description")
        if capacity is not None:
            section.capacity = capacity
        if description is not None:
            section.description = description
        section.save()
        return Response(status=status.HTTP_201_CREATED)


@api_view(["GET"])
def student_details(request, student_id):
    """
    GET: Return student details
    """
    if request.method == "GET":
        student = Student.objects.get(id=student_id)
        serializer = StudentSerializer(student)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET", "POST"])
def student_attendance(request, student_id):
    """
    GET: Return a list of attendance objects for student
    POST: Update associated attendance object with new fields.
    """
    attendances = Attendance.objects.filter(student__id=student_id)
    if request.method == "GET":
        serializer = AttendanceSerializer(attendances, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == "POST":
        target_attendance = attendances.get(date=request.data.get("date"))
        target_attendance.presence = request.data.get("presence")
        target_attendance.save()
        serializer = AttendanceSerializer(target_attendance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
def student_drop(request, student_id):
    """
    DELETE: Change student `active` status to false.
    """
    if request.method == "DELETE":
        student = Student.objects.get(id=student_id)
        student.active = False
        student.save()
        serializer = StudentSerializer(student)
        return Response(serializer.data, status=status.HTTP_200_OK)

