import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  StyledTheology,
  StyledFormHeader,
  StyledTheologyContainer,
  StyledBasicEdPersonalFieldWrapper,
  StyledBasicEdFieldWrapper,
  StyledBasicEdEducationalFieldWrapper,
  StyledTheologyCheckboxWrapper,
  StyledTheologyCheckboxError,
} from "styles";
import {
  Navigation,
  InputWrapper,
  Input,
  RadioWrapper,
  Radio,
  Form,
  Checkbox,
  Modal,
} from "components";

import {
  EnrolleeStatusProps,
  PersonalProps,
  EducationalProps,
  TestimonyProps,
  SectionContainer,
  PaymentProps,
} from "routes";
import { useEmail } from "hooks";
import { transformDate } from "utils";

type Props = {} & RouteComponentProps;

type BasicEdTypes = EnrolleeStatusProps &
  PersonalProps &
  EducationalProps &
  TestimonyProps &
  PaymentProps;

const SeniorHighSchool: React.FC<Props> = () => {
  const sendEmail = useEmail<BasicEdTypes>("spbts_basic_ed_admission_template");

  const { register, errors, watch, setValue, handleSubmit } = useForm<
    BasicEdTypes
  >();

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showLoadingModal, setShowLoading] = useState(false);

  const [disabled, setDisabled] = useState(false);

  const onFormSubmit = async (data: BasicEdTypes) => {
    setDisabled(true);
    setShowLoading(true);

    console.log(data);

    const birthDate = transformDate(data.birthDate);

    const newData = {
      ...data,
      birthDate,
    };

    try {
      const response = await sendEmail(newData);

      if (response) {
        setTimeout(() => {
          setShowLoading(false);
          setShowSuccessModal(true);
          setDisabled(false);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isForeignerStudent =
    watch("typeOfStudent")?.toLocaleLowerCase() === "foreigner";

  const isMoneyTransfer =
    watch("paymentMethod")?.toLocaleLowerCase() === "money transfer";

  useEffect(() => {
    setValue("educationLevel", "Senior High");

    if (isMoneyTransfer) {
      setValue("paymentBank", "");
    } else {
      setValue("paymentService", "");
    }
  }, [isMoneyTransfer, setValue]);

  return (
    <StyledTheology>
      <Navigation />

      <Modal
        type="success"
        visible={showSuccessModal}
        title="success"
        heading="Submitted Successfully"
        subHeading="Your form has been successfully submitted."
        onClose={() => setShowSuccessModal(false)}
      />

      <Modal
        type="info"
        visible={showLoadingModal}
        title="information"
        heading="Processing"
        subHeading="Please wait. Your information is being process."
        onClose={() => setShowLoading(false)}
      />

      <StyledTheologyContainer>
        <Form onSubmit={handleSubmit(onFormSubmit)} disabled={disabled}>
          <StyledFormHeader>
            <h1>Admission Form</h1>
            <p>Please fill all necessary information with all honesty.</p>
            <p>Please note, an asterisk(*) denotes a required field.</p>
          </StyledFormHeader>

          <SectionContainer heading="Enrollee Status">
            <StyledBasicEdFieldWrapper>
              <RadioWrapper
                id="type-of-student"
                heading="What student type are you?"
                error={errors.typeOfStudent && "Student Types is Required!"}
              >
                <Radio
                  label="New Student"
                  name="typeOfStudent"
                  value="New Student"
                  ref={register({ required: true })}
                />
                <Radio
                  label="Current Student"
                  name="typeOfStudent"
                  value="Current Student"
                  ref={register({ required: true })}
                />
                <Radio
                  label="Transferee"
                  name="typeOfStudent"
                  value="Transferee"
                  ref={register({ required: true })}
                />
                <Radio
                  label="Returning Student"
                  name="typeOfStudent"
                  value="Returning Student"
                  ref={register({ required: true })}
                />
                <Radio
                  label="Foreigner"
                  name="typeOfStudent"
                  value="Foreigner"
                  ref={register({ required: true })}
                />
              </RadioWrapper>

              <InputWrapper
                heading="School Year"
                id="school-year"
                columns="repeat(2, 1fr)"
              >
                <Input
                  type="number"
                  label="From"
                  placeholder="year"
                  id="from-year"
                  name="schoolYear.from"
                  ref={register({ required: true })}
                  error={errors.schoolYear?.from && "from year is required"}
                />
                <Input
                  type="number"
                  label="To"
                  placeholder="year"
                  id="to-year"
                  name="schoolYear.to"
                  ref={register({ required: true })}
                  error={errors.schoolYear?.to && "to year is required"}
                />
              </InputWrapper>

              <InputWrapper
                heading="Last School Year Attended"
                id="last-school-year"
                columns="repeat(2, 1fr)"
              >
                <Input
                  type="number"
                  label="From"
                  placeholder="year"
                  id="last-from-year"
                  name="lastSyFromYear"
                  ref={register({ required: true })}
                  error={errors.lastSyFromYear && "This field is required"}
                />
                <Input
                  type="number"
                  label="To"
                  placeholder="year"
                  id="last-to-year"
                  name="lastSyToYear"
                  ref={register({ required: true })}
                  error={errors.lastSyToYear && "This field is required"}
                />
              </InputWrapper>

              <InputWrapper
                heading="Current Education"
                id="desired-course"
                columns="repeat(3, 1fr)"
              >
                <Input
                  label="Education Level"
                  id="sh-course-name"
                  name="educationLevel"
                  ref={register({ required: true })}
                  error={errors.educationLevel && "education level is required"}
                  readOnly
                />
                <Input
                  type="number"
                  id="grade-level"
                  label="grade level"
                  name="gradeLevel"
                  ref={register({ required: true })}
                  error={errors.gradeLevel && "grade level is required"}
                />
                <Input
                  label="academic track"
                  placeholder="ABM / HUMSS"
                  id="academic-track"
                  name="academicTrack"
                  ref={register({ required: true })}
                  error={errors.academicTrack && "academic track is required"}
                />
              </InputWrapper>
            </StyledBasicEdFieldWrapper>
          </SectionContainer>

          <SectionContainer heading="Personal Information">
            <StyledBasicEdPersonalFieldWrapper>
              <InputWrapper
                heading="Full Name"
                id="full-name"
                columns="repeat(3, 1fr)"
              >
                <Input
                  label="First Name"
                  id="first-name"
                  name="firstName"
                  ref={register({ required: true })}
                  error={errors.firstName && "first name is required"}
                />
                <Input
                  label="Last Name"
                  id="last-name"
                  name="lastName"
                  ref={register({ required: true })}
                  error={errors.lastName && "last name is required"}
                />
                <Input
                  label="Middle Name"
                  id="middle-name"
                  name="middleName"
                  ref={register({ required: true })}
                  error={errors.middleName && "middle name is required"}
                />
                <Input
                  label="Suffix"
                  placeholder="Ex. Jr / Sr"
                  id="suffix"
                  required={false}
                  name="suffix"
                  ref={register}
                />
              </InputWrapper>

              <InputWrapper
                heading="Gender"
                id="gender-status"
                columns="repeat(3, 1fr)"
              >
                <Input
                  label="gender"
                  placeholder="Male / Female"
                  name="gender"
                  ref={register({ required: true })}
                  error={errors.gender && "gender is required"}
                />
              </InputWrapper>

              <InputWrapper
                heading="Birth Information"
                id="birth-info"
                columns="repeat(3, 1fr)"
              >
                <Input
                  label="birth place"
                  id="birth-place"
                  name="birthPlace"
                  ref={register({ required: true })}
                  error={errors.birthPlace && "birth place is required"}
                />
                <Input
                  type="date"
                  label="birth date"
                  id="birth-date"
                  name="birthDate"
                  ref={register({ required: true })}
                  error={errors.birthDate && "birth date is required"}
                />
                <Input
                  type="number"
                  label="age"
                  id="age"
                  name="age"
                  ref={register({ required: true })}
                  error={errors.age && "age is required"}
                />
              </InputWrapper>

              <InputWrapper
                heading="Nationality"
                id="nationalism"
                columns="repeat(3, 1fr)"
              >
                <Input
                  label="nationality"
                  id="nationality"
                  name="nationality"
                  ref={register({ required: true })}
                  error={errors.nationality && "nationality is required"}
                />
                <Input
                  label="dialect"
                  id="dialect"
                  name="dialect"
                  ref={register({ required: true })}
                  error={errors.dialect && "dialect is required"}
                />
                <Input
                  label="ethnic affiliation"
                  placeholder="Ex. Cebuano / etc."
                  id="ethnic"
                  name="ethnicAffiliation"
                  ref={register({ required: true })}
                  error={
                    errors.ethnicAffiliation && "ethnicAffiliation is required"
                  }
                />
                <Input
                  label="religion"
                  placeholder="religion"
                  id="religion"
                  name="religion"
                  ref={register({ required: true })}
                  error={errors.religion && "religion is required"}
                />
              </InputWrapper>

              <InputWrapper
                heading="Contact Information"
                id="contact-information"
                columns="repeat(3, 1fr)"
              >
                <Input
                  type="number"
                  label="contact number"
                  id="contact-number"
                  name="contactNumber"
                  ref={register({ required: true })}
                  error={errors.contactNumber && "contactNumber is required"}
                />
                <Input
                  type="email"
                  label="email address"
                  id="email"
                  name="emailAddress"
                  ref={register({
                    required: true,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "invalid email address",
                    },
                  })}
                  error={errors.emailAddress && "email address is required"}
                />
                <Input
                  label="facebook account"
                  id="facebook-account"
                  name="facebookAccount"
                  ref={register({ required: true })}
                  error={
                    errors.facebookAccount && "facebook account is required"
                  }
                />
                <Input
                  label={
                    isForeignerStudent ? "philippine address" : "home address"
                  }
                  id="home-address"
                  name="homeAddress"
                  ref={register({ required: true })}
                  error={
                    (errors.homeAddress &&
                      isForeignerStudent &&
                      "philippine Address is required") ||
                    (errors.homeAddress &&
                      !isForeignerStudent &&
                      "home Address is required") ||
                    ""
                  }
                />

                {isForeignerStudent && (
                  <Input
                    label="home country address"
                    id="home-country-address"
                    name="homeCountryAddress"
                    ref={register({ required: true })}
                    error={
                      errors.homeCountryAddress &&
                      "home Country Address is required"
                    }
                  />
                )}
              </InputWrapper>

              <InputWrapper
                heading="Parent's / Family Annual Income"
                id="parents-income"
                columns="repeat(2, 1fr)"
              >
                <Input
                  label="Annual Income"
                  id="parents-annual-income"
                  name="parentsAnnualIncome.annualIncome"
                  ref={register({ required: true })}
                  error={
                    errors.parentsAnnualIncome?.annualIncome &&
                    "annual income is required"
                  }
                />
                <Input
                  label="Other Income"
                  placeholder="please specify"
                  id="parents-other-income"
                  name="parentsAnnualIncome.otherIncome"
                  ref={register}
                  required={false}
                />
              </InputWrapper>

              <InputWrapper
                heading="Parent's Information"
                id="parent-information"
                columns="repeat(3, 1fr)"
              >
                <Input
                  label="father's name"
                  placeholder="father's complete name"
                  id="fathers-name"
                  name="parentsInfo.fathersName"
                  ref={register({ required: true })}
                  error={
                    errors.parentsInfo?.fathersName &&
                    "father's name is required"
                  }
                />
                <Input
                  label="occupation"
                  placeholder="occupation"
                  id="fathers-occupation"
                  name="parentsInfo.fathersOccupation"
                  ref={register({ required: true })}
                  error={
                    errors.parentsInfo?.fathersOccupation &&
                    "occupation is required"
                  }
                />
                <Input
                  label="mother's name"
                  placeholder="mother's complete name"
                  id="mothers-name"
                  name="parentsInfo.mothersName"
                  ref={register({ required: true })}
                  error={
                    errors.parentsInfo?.mothersName &&
                    "mother's name is required"
                  }
                />
                <Input
                  label="occupation"
                  placeholder="occupation"
                  id="mothers-occupation"
                  name="parentsInfo.mothersOccupation"
                  ref={register({ required: true })}
                  error={
                    errors.parentsInfo?.mothersOccupation &&
                    "occupation is required"
                  }
                />
              </InputWrapper>

              <InputWrapper
                heading="Scholarship Information"
                id="scholarship-info"
                columns="repeat(3, 1fr)"
              >
                <Input
                  label="scholarship"
                  id="scholarship"
                  name="scholarship"
                  ref={register}
                  required={false}
                />
                <Input
                  label="amount"
                  id="amount"
                  name="scholarshipAmmount"
                  ref={register}
                  required={false}
                />
              </InputWrapper>
            </StyledBasicEdPersonalFieldWrapper>
          </SectionContainer>

          <SectionContainer heading="Educational Background">
            <StyledBasicEdEducationalFieldWrapper>
              <InputWrapper
                heading="elementary"
                id="elementary"
                columns="repeat(3, 1fr)"
              >
                <Input
                  label="school name"
                  id="elementary-school-name"
                  name="elementarySchoolName"
                  ref={register({ required: true })}
                  error={
                    errors.elementarySchoolName && "school name is required"
                  }
                />
                <Input
                  type="number"
                  label="year graduated"
                  id="elementary-year-graduated"
                  name="elementaryYearGraduated"
                  ref={register({ required: true })}
                  error={
                    errors.elementaryYearGraduated &&
                    "year graduated is required"
                  }
                />
              </InputWrapper>

              <InputWrapper
                heading="junior high school"
                id="junior-high-school"
                columns="repeat(3, 1fr)"
              >
                <Input
                  label="school name"
                  id="jh-school-name"
                  name="jhSchoolName"
                  ref={register({ required: true })}
                  error={errors.jhSchoolName && "school name is required"}
                />
                <Input
                  type="number"
                  label="year graduated"
                  id="jh-year-graduated"
                  name="jhYearGraduated"
                  ref={register({ required: true })}
                  error={errors.jhYearGraduated && "year graduated is required"}
                />
              </InputWrapper>

              <InputWrapper
                heading="Authorized person/s to have an access on your school records"
                id="authorized-persons"
                columns="repeat(6, 1fr)"
              >
                <Input
                  label="complete name"
                  id="authorized-person-name-1"
                  name="authorizedPerson1Name"
                  ref={register({ required: true })}
                  error={
                    errors.authorizedPerson1Name && "this field is required"
                  }
                />
                <Input
                  label="relationship"
                  id="authorized-person-relationship-1"
                  name="authorizedPerson1Relationship"
                  ref={register({ required: true })}
                  error={
                    errors.authorizedPerson1Relationship &&
                    "this field is required"
                  }
                />
                <Input
                  label="complete name"
                  id="authorized-person-name-2"
                  name="authorizedPerson2Name"
                  ref={register({ required: true })}
                  error={
                    errors.authorizedPerson2Name && "this field is required"
                  }
                />
                <Input
                  label="relationship"
                  id="authorized-person-relationship-2"
                  name="authorizedPerson2Relationship"
                  ref={register({ required: true })}
                  error={
                    errors.authorizedPerson2Relationship &&
                    "this field is required"
                  }
                />
              </InputWrapper>
            </StyledBasicEdEducationalFieldWrapper>
          </SectionContainer>

          <StyledTheologyCheckboxWrapper
            error={errors.certifyTrue ? true : false}
          >
            <Checkbox
              label="I certify that all information stated and written above are true and correct. With my consent, I agree that the information and data provided will be used only for whatever legal purposes, do hereby promulgated. [ Section 16 R.A. 10173, known as Data Privacy Act of 2012 ]."
              id="certify"
              containerId="certify-checkbox"
              name="certifyTrue"
              ref={register({ required: true })}
            />
            {errors.certifyTrue && (
              <StyledTheologyCheckboxError>
                This field is required!
              </StyledTheologyCheckboxError>
            )}
          </StyledTheologyCheckboxWrapper>
        </Form>
      </StyledTheologyContainer>
    </StyledTheology>
  );
};

export default SeniorHighSchool;
