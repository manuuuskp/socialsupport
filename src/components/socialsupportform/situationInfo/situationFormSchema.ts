import * as yup from 'yup';
import i18n from "i18next";

export const situtationFormSchema = yup.object({
    financialSituation: yup.string().trim().required('validation.required').min(15, ({ min }) => i18n.t("validation.minLength", { min })),
    employmentCircumstances: yup.string().trim().required('validation.required').min(15, ({ min }) => i18n.t("validation.minLength", { min })),
    reasonForApplying: yup.string().trim().required('validation.required').min(15, ({ min }) => i18n.t("validation.minLength", { min })),
});