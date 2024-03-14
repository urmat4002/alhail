import { FC, useState } from "react";
import { X } from "lucide-react";
import { AxiosError } from "axios";
import { PhoneInput } from "react-international-phone";
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
import { FormMessage } from "./FormMessage/FormMessage";
import styles from "./Form.module.scss";
import { GButton } from "@/shared/ui/Button/GButton";

type FormProps = {
  variant: "download_catalog" | "buy" | "sell" | "consultation";
};

type FormParams = {
  title: string;
  subTitle: string;
  buttonCaption: string;
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
  name: "",
  phone: "",
  city: "",
  email: "",
  date: "",
  role: 1,
};

export const Form: FC<FormProps> = ({ variant }) => {
  const { id: estateId } = useParams();
  const { staticData } = useGetStaticData();
  const { choices } = useGetStaticFormDownloadCatalog();

  const { closeModal, pdfUrl } = useModalContext();

  const [calendarActive, setCalendarActive] = useState(false);

  const [formState, setFormState] = useState(initialFormState);
  const [message, setMessage] = useState<FormMessage | null>(null);

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
      formParams.closeButton = true;
      break;
  }

  const handleSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
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
      const { data } = await axiosAPI.post(`/appeal/${variant}/`, formData);
      if (variant === "download_catalog") {
        localStorage.setItem("questionnaire", "true");
        setTimeout(() => {
          pdfUrl && window.open(pdfUrl, "_blank");
        }, 500);
      }
      //on success
      setMessage({
        title: data.form.successfully,
        subtitle: data.form.thanks,
        handleClose:
          variant === "download_catalog" || variant === "sell"
            ? closeModal
            : () => setMessage(null),
      });
    } catch (e) {
      //on error
      const error = e as AxiosError;
      const errorData = error?.response?.data as
        | Record<string, string[]>
        | undefined;
      let errorMessage = "";
      if (errorData) {
        errorMessage = Object.keys(errorData)
          .map(
            (errorKey) =>
              `${capitalize(errorKey)}: ${errorData[errorKey].join("\n ")}`
          )
          .join("\n ");
      }
      setMessage({
        title: staticData?.forms.error_title || "Looks like a server error.",
        subtitle: errorMessage,
        handleClose: () => setMessage(null),
      });
      localStorage.removeItem("questionnaire");
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
            placeholder={capitalize(staticData?.forms.your_city) || "Your city"}
          />
        )}

        <PhoneInput
          className={styles.formInput}
          value={formState.phone}
          hideDropdown
          countrySelectorStyleProps={{ style: { display: "none" } }}
          disableDialCodePrefill
          placeholder={
            capitalize(staticData?.forms.phone_number) || "Phone number"
          }
          onChange={(value) =>
            setFormState((prev) => ({ ...prev, phone: value }))
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
              readOnly
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
        <GButton onClick={handleSubmit}>{formParams.buttonCaption}</GButton>
      </div>

      {formParams.closeButton && (
        <button onClick={closeModal} className={styles.closeButton}>
          <X color="white" />
        </button>
      )}

      <input
        className={styles.honeypot}
        value={formState.lastName}
        type="text"
        id="lastName"
        name="last_name"
        onChange={handleChange}
      />

      <FormMessage message={message} />
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
