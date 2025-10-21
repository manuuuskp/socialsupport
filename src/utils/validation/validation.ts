import * as yup from "yup";
import type { ObjectSchema } from "yup";
import { familyFormSchema } from "../../components/socialsupportform/familyInfo/familyFormSchema";
import { personalFormSchema } from "../../components/socialsupportform/personalInfo/personalFormSchema";
import { situtationFormSchema } from "../../components/socialsupportform/situationInfo/situationFormSchema";

type StepSchemas = Record<number, yup.ObjectSchema<any>>;

export const stepSchemas: StepSchemas = {
    0: personalFormSchema,
    1: familyFormSchema,
    2: situtationFormSchema,
}

export const getSchemaForStep = (step: number, skipFields: string[] = []): ObjectSchema<any> => {
    let schema = stepSchemas[step as keyof typeof stepSchemas];
    if (skipFields.length > 0) {
        schema = (schema as any).omit(skipFields);
    }
    return schema;
};