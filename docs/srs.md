# Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose

The purpose of this document is to describe the requirements of the Phishing Detection and Mitigation System. This system aims to detect phishing URLs, emails, or websites and warn users in real time, thereby reducing the risk of cyber fraud.

### 1.2 Scope

The system will analyze URLs and content using predefined rules and machine learning techniques to identify phishing attempts. It will provide risk scores, alerts, and mitigation suggestions to users.

### 1.3 Definitions

* **Phishing**: A cyberattack that attempts to steal sensitive information by impersonating a trusted entity.
* **URL Analysis**: Examining URL structure to detect malicious patterns.
* **Mitigation**: Actions taken to reduce or prevent harm.

---

## 2. Overall Description

### 2.1 Product Perspective

This is a standalone web-based application that can later be integrated with browsers, email clients, or enterprise systems.

### 2.2 User Classes

* General Users
* Security Analysts (Admin)

### 2.3 Operating Environment

* Web Browser (Chrome, Edge, Firefox)
* Backend Server
* Database

### 2.4 Design Constraints

* Must provide fast response time
* Must ensure data privacy

---

## 3. Functional Requirements

### FR1: URL Input

The system shall allow users to input a URL or email content for analysis.

### FR2: Phishing Detection

The system shall analyze the input using rule-based checks and ML models.

### FR3: Risk Classification

The system shall classify results as Safe, Suspicious, or Phishing.

### FR4: User Alert

The system shall display alerts and warnings to users.

### FR5: Mitigation Suggestions

The system shall suggest actions such as avoiding the site or reporting it.

---

## 4. Non-Functional Requirements

### Performance

* Response time < 3 seconds

### Security

* Secure handling of user input

### Usability

* Simple and intuitive UI

---

## 5. Future Enhancements

* Browser extension support
* Email client integration
* Real-time blacklist updates

---

# System Architecture (Initial)

## Architecture Overview

**Frontend**

* User Interface (HTML, CSS, JavaScript)

**Backend**

* API Server (Python/Node.js)
* Phishing Detection Engine

**Database**

* Store URLs, logs, and reports

---

## Data Flow (Simple)

1. User submits URL
2. Frontend sends request to backend
3. Backend analyzes URL
4. Result returned to frontend
5. Alert displayed to user

---

## Tech Stack (Initial)

* Frontend: HTML, CSS, JavaScript, react(if more complex)
* Backend: Python (Flask) or Node.js  //not decided
* Database: MongoDB
* ML (Later): Scikit-learn

---

## Git First Push Contents

* README.md
* SRS Document


---

*This document is intended for initial project planning and version control.*
