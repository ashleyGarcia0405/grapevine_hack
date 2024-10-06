"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignUp() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [skills, setSkills] = useState([""]);
  const [education, setEducation] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    github: "",
    // twitter: ''
  });
  const [projects, setProjects] = useState([
    {
      title: "",
      description: "",
      link: "",
      image: "",
    },
  ]);
  const [projectInterest, setProjectInterest] = useState("");
  const [interests, setInterests] = useState([""]);
  const [showDropdown, setShowDropdown] = useState(false); // State to manage dropdown visibility
  const [tags, setTags] = useState([]); // State to manage selected tags
  const availableTags = ["MEC (MIT)", "DivHacks (Columbia)"]; // Example tags for the dropdown
  const router = useRouter();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProfileImage(data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    try {
      const userData = {
        name,
        email,
        password,
        profileImage,
        bio,
        location,
        website,
        skills: skills.filter((skill) => skill.trim() !== ""),
        education,
        socialLinks,
        projects,
        projectInterest,
        interests: interests.filter((interest) => interest.trim() !== ""),
        events: tags, // Use the selected tags as events
      };

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Signup failed:", response.status, errorData);
        return;
      }

      const data = await response.json();
      console.log("Signup successful", data);

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/profile");
      } else {
        console.error("Sign in failed after registration", signInResult);
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  const addField = (setter, array) => {
    setter([...array, ""]);
  };

  const updateField = (setter, array, index, value) => {
    const newArray = [...array];
    newArray[index] = value;
    setter(newArray);
  };

  // Function to add a tag
  const addTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-purple-900">
            {step === 1 ? "Sign up for Grapevine 🍇" : "Complete Your Profile"}
          </h2>
          <p className="mt-2 text-center text-sm text-purple-600">
            Connect and collaborate on passion projects
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          {step === 1 ? (
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-purple-300 placeholder-purple-500 text-purple-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-purple-300 placeholder-purple-500 text-purple-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-purple-300 placeholder-purple-500 text-purple-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div>
                  <label
                    htmlFor="profileImage"
                    className="block text-sm font-medium text-purple-700"
                  >
                    Profile Image
                  </label>
                  <input
                    type="file"
                    id="profileImage"
                    onChange={handleImageUpload}
                    className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-purple-50 file:text-purple-700
                    hover:file:bg-purple-100"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-purple-700"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="3"
                  required
                  className="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  placeholder="Tell us about yourself"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="projectInterest"
                  className="block text-sm font-medium text-purple-700"
                >
                  Project Interest
                </label>
                <input
                  type="text"
                  id="projectInterest"
                  name="projectInterest"
                  required
                  className="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  placeholder="What projects are you interested in?"
                  value={projectInterest}
                  onChange={(e) => setProjectInterest(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="education"
                  className="block text-sm font-medium text-purple-700"
                >
                  School
                </label>
                <input
                  type="text"
                  id="education"
                  name="education"
                  className="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  placeholder="Your education"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-purple-700"
                >
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  className="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  placeholder="https://example.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700">
                  Skills
                </label>
                {skills.map((skill, index) => (
                  <input
                    key={index}
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    placeholder="Enter a skill"
                    value={skill}
                    onChange={(e) =>
                      updateField(setSkills, skills, index, e.target.value)
                    }
                  />
                ))}
                <button
                  type="button"
                  onClick={() => addField(setSkills, skills)}
                  className="mt-2 text-sm text-purple-600"
                >
                  Add Skill
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700">
                  Social Links
                </label>
                <input
                  type="url"
                  placeholder="LinkedIn"
                  value={socialLinks.linkedin}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, linkedin: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                />
                <input
                  type="url"
                  placeholder="GitHub"
                  value={socialLinks.github}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, github: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                />
                {/* <input
                  type="url"
                  placeholder="Twitter"
                  value={socialLinks.twitter}
                  onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})}
                  className="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                /> */}
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700">
                  Interests
                </label>
                {interests.map((interest, index) => (
                  <input
                    key={index}
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    placeholder="Enter an interest"
                    value={interest}
                    onChange={(e) =>
                      updateField(
                        setInterests,
                        interests,
                        index,
                        e.target.value
                      )
                    }
                  />
                ))}
                <button
                  type="button"
                  onClick={() => addField(setInterests, interests)}
                  className="mt-2 text-sm text-purple-600"
                >
                  Add Interest
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-700">
                  Events
                </label>
                <div
                  className="mt-2 p-2 border border-purple-300 rounded-md cursor-pointer relative" // White bar styles
                  onClick={() => setShowDropdown(!showDropdown)} // Toggle dropdown visibility on click
                >
                  {tags.length === 0 ? (
                    <span className="text-gray-500">Click to add an event</span>
                  ) : (
                    tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded-full text-white ${
                          tag.includes("MEC (MIT)") // Example condition for color
                            ? "bg-red-500 opacity-70"
                            : "bg-blue-500 opacity-70"
                        } text-xs mr-1`} // Adjusted to text-xs for smaller tags
                      >
                        {tag}
                        <button
                          type="button"
                          className="ml-1 text-xs"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent click event from bubbling up
                            setTags(tags.filter((t) => t !== tag)); // Remove tag
                          }}
                        >
                          ✕
                        </button>
                      </span>
                    ))
                  )}
                </div>
                {showDropdown && ( // Conditionally render the dropdown when the bar is clicked
                  <div className="absolute mt-1 w-full bg-white border border-purple-300 rounded-md shadow-lg z-10">
                    {availableTags.map((tag, index) => (
                      <div
                        key={index}
                        className="p-2 cursor-pointer hover:bg-purple-100"
                        onClick={() => {
                          addTag(tag); // Add tag to the list
                          setShowDropdown(false); // Close dropdown after selection
                        }}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {step === 1 ? "Next" : "Sign up"}
            </button>
          </div>
        </form>
        {step === 1 && (
          <div className="text-center">
            <p className="mt-2 text-sm text-purple-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Go back to login
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}