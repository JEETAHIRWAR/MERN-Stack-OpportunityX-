import React from "react";

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-12 px-6 sm:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-center text-gray-900">
            About OpportunityX
          </h1>
          <p className="mt-4 text-gray-700 text-lg text-center">
            Welcome to OpportunityX, a premier job portal and a proud branch of{" "}
            <span className="font-semibold text-blue-600">
              GhostCode Dynamics
            </span>
            . At OpportunityX, we are committed to bridging the gap between job
            seekers and the plethora of opportunities available in the job
            market. Our mission is to empower individuals by providing them with
            the tools and resources they need to succeed in their careers.
          </p>
          <hr className="my-8 border-gray-300" />
          <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">
            Our Services
          </h2>
          <ul className="list-disc list-inside text-gray-700 text-lg mb-4">
            <li className="ml-6">
              <strong>Learning Material:</strong> We offer a comprehensive
              collection of learning materials to help you upskill and stay
              competitive in the job market. Whether you're looking to brush up
              on your existing skills or learn something entirely new, our
              resources are designed to cater to all your learning needs.
            </li>
            <li className="ml-6">
              <strong>Job Assistance:</strong> Finding the right job can be
              challenging. At OpportunityX, we provide personalized job
              assistance to help you navigate the job market with confidence.
              Our experts are here to offer guidance, tips, and support every
              step of the way.
            </li>
            <li className="ml-6">
              <strong>Multiple Job Opportunities:</strong> We host a diverse
              range of job opportunities across various industries. Whether
              you're a fresh graduate or an experienced professional, you can
              find positions that match your skills and career aspirations on
              our platform.
            </li>
            <li className="ml-6">
              <strong>Consulting Services:</strong> Our consulting services are
              designed to help businesses and job seekers alike. Whether you
              need strategic advice, career counseling, or industry insights,
              our team of experts is here to assist you in making informed
              decisions.
            </li>
          </ul>

          <h2 className="mt-8 text-3xl font-bold text-gray-900">
            About GhostCode Dynamics
          </h2>
          <p className="mt-4 text-gray-700 text-lg">
            Welcome to{" "}
            <span className="font-semibold text-blue-600">
              GhostCode Dynamics
            </span>
            , a distinguished software company dedicated to delivering premier
            solutions in the digital realm. Our expertise spans a wide spectrum
            of services, including comprehensive training programs and seamless
            placements. We offer invaluable internships and hands-on experience
            in software design, coding, and programming.
          </p>
          <p className="mt-4 text-gray-700 text-lg">
            With a focus on meticulous software testing and uncompromising
            quality assurance, our team ensures the excellence of every project
            we undertake. Our proficiency extends to crafting innovative web and
            mobile applications, user-centric UX/UI design, and the rigorous
            practice of bug bounty hunting.
          </p>
          <p className="mt-4 text-gray-700 text-lg">
            At GhostCode Dynamics, we set unparalleled standards in error
            handling and code review, guaranteeing the highest caliber in every
            aspect of software development. Partner with us to embark on a
            journey of technological excellence and innovation.
          </p>
          <hr className="my-8 border-gray-300" />
          <p className="text-gray-700 text-lg mt-8">
            By visiting OpportunityX, you're taking a significant step toward
            achieving your career goals. Whether you're seeking a new job,
            looking to enhance your skills, or in need of expert career advice,
            OpportunityX is here to support you. Join us and explore the
            multitude of opportunities that await you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
