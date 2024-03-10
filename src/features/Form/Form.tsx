import { FC, ReactNode, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/ui/Button/Button";
import { Select, Typography } from "@/shared/ui";
import { Calendar } from "@/shared/ui/Calendar";
import {
  useGetStaticData,
  useGetStaticFormDownloadCatalog,
} from "@/shared/api/hooks";
import { capitalize } from "@/shared/helper/utils";
import { axiosAPI } from "@/shared/api/axiosApi";
import { SelectItem } from "@/shared/ui/Select/Select";
import { useParams } from "react-router-dom";
import { useModalContext } from "@/app/providers/useModalContext";
import styles from "./Form.module.scss";

type FormProps = {
  variant: "download_catalog" | "buy" | "sell" | "consultation";
};

type FormParams = {
  title: string;
  subTitle: string;
  buttonCaption: string;
  buttonIcon: ReactNode;
  closeButton: boolean;
};

type FormData = {
  last_name: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  at_date?: string;
  appeal_type: string;
  estate_id?: string;
  role?: string;
};

const initialFormState = {
  lastName: "",
  name: "Elon Musk",
  phone: "+996700111222",
  city: "",
  email: "aaa@bbb.com",
  date: "",
  role: 1,
};

export const Form: FC<FormProps> = ({ variant }) => {
  const { id: estateId } = useParams();
  const { staticData } = useGetStaticData();
  const { choices } = useGetStaticFormDownloadCatalog();

  const { closeModal, showFormMessageSuccess, showFormMessageError, pdfUrl } =
    useModalContext();

  const [calendarActive, setCalendarActive] = useState(false);

  const [formState, setFormState] = useState(initialFormState);

  const roleApiNames: Record<number, string> = {};
  const roleOptions: SelectItem[] = [];

  for (const key in choices) {
    if (choices != undefined) {
      const id = roleOptions.length + 1;
      roleOptions.push({ id, label: choices[key] });
      roleApiNames[id] = key;
    }
  }

  const formParams: FormParams = {
    title: "",
    subTitle: "",
    buttonCaption: "",
    buttonIcon: null,
    closeButton: false,
  };

  switch (variant) {
    case "buy":
      formParams.title = staticData?.forms.submit_application || "...";
      formParams.subTitle = staticData?.forms.fill_form || "...";
      formParams.buttonCaption = staticData?.forms.send || "...";
      break;
    case "sell":
      formParams.title = staticData?.forms.sell_with_us || "...";
      formParams.subTitle = staticData?.forms.fill_form || "...";
      formParams.buttonCaption = staticData?.forms.send || "...";
      formParams.closeButton = true;
      break;
    case "consultation":
      formParams.title = staticData?.forms.any_question || "...";
      formParams.subTitle = staticData?.forms.leave_your_contacts || "...";
      formParams.buttonCaption = staticData?.forms.send || "...";
      break;
    case "download_catalog":
      formParams.title = staticData?.forms.download_catalog || "...";
      formParams.subTitle = staticData?.forms.catalog_fill_form || "...";
      formParams.buttonCaption = staticData?.forms.download || "...";
      //FIX_ME add suitable icon
      formParams.buttonIcon = null;
      formParams.closeButton = true;
      break;
  }

  const handleSubmit = async () => {
    const formData: FormData = {
      last_name: formState.lastName,
      name: formState.name,
      phone: formState.phone,
      email: formState.email,
      city: formState.city,
      at_date: formState.date,
      appeal_type: variant,
      estate_id: estateId,
    };
    if (variant === "download_catalog") {
      formData.role = roleApiNames[formState.role];
    }

    try {
      await axiosAPI.post(`/appeal/${variant}/`, formData);
      if (variant === "download_catalog") {
        localStorage.setItem("questionnaire", "true");
        setTimeout(() => {
          pdfUrl && window.open(pdfUrl, "_blank");
        }, 500);
      }
      showFormMessageSuccess();
    } catch {
      localStorage.removeItem("questionnaire");
      showFormMessageError();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const fieldName = event.target.id;
    setFormState((prev) => ({ ...prev, [fieldName]: newValue }));
  };

  return (
    <form className={styles.form}>
      <FormHeading formParams={formParams} />

      <div className={styles.formGrid}>
        <input
          className={styles.formInput}
          id="name"
          name="name"
          value={formState.name}
          onChange={handleChange}
          placeholder={capitalize(staticData?.forms.your_name) || "Name"}
        />

        {variant === "download_catalog" ? (
          <input
            className={styles.formInput}
            id="email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            placeholder={
              capitalize(staticData?.forms.your_email) || "Your email"
            }
          />
        ) : (
          <input
            className={styles.formInput}
            id="city"
            name="city"
            value={formState.city}
            onChange={handleChange}
            placeholder={"Your city"}
          />
        )}

        <input
          className={styles.formInput}
          id="phone"
          name="phone"
          value={formState.phone}
          onChange={handleChange}
          placeholder={
            capitalize(staticData?.forms.phone_number) || "Phone number"
          }
        />

        {variant === "download_catalog" ? (
          <Select
            value={[formState.role]}
            options={roleOptions}
            onChange={(newRole) =>
              setFormState((prev) => ({ ...prev, role: newRole[0] }))
            }
            placeholder={
              capitalize(staticData?.forms.select_role) || "Select role"
            }
            backgroundColor={false}
          />
        ) : (
          <>
            <input
              className={styles.formInput}
              id="date"
              name="date"
              value={formState.date}
              onFocus={() => setCalendarActive(true)}
              placeholder={capitalize(staticData?.forms.date) || "Date"}
              onChange={handleChange}
            />
            <Calendar
              calendarActive={calendarActive}
              setCalendarActive={() => setCalendarActive(false)}
              setDate={(newDate) =>
                setFormState((prev) => ({ ...prev, date: newDate }))
              }
            />
          </>
        )}
      </div>

      <div className={styles.formButton}>
        <Button onClick={handleSubmit} type="primary">
          <Typography variant="button">
            {formParams.buttonCaption}
            {formParams.buttonIcon}
          </Typography>
        </Button>
      </div>

      {formParams.closeButton && (
        <Button
          onClick={closeModal}
          customClasses={styles.closeButton}
          type="icon"
        >
          <X color="white" />
        </Button>
      )}

      <input
        className={styles.honeypot}
        value={formState.lastName}
        type="text"
        id="lastName"
        name="last_name"
        onChange={handleChange}
      />
    </form>
  );
};

const FormHeading: FC<{ formParams: FormParams }> = ({ formParams }) => (
  <>
    <Typography variant="h3" weight="medium" color="gold" capitalize>
      {formParams.title}
    </Typography>
    <Typography
      className={styles.subtitle}
      variant="body"
      weight="medium"
      color="white"
      capitalize
    >
      {formParams.subTitle}
    </Typography>
  </>
);
