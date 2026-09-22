import { useMutation } from "@tanstack/react-query";
import { submitContact } from "../lib/api";

/**
 * Submits the contact form and exposes the request state to the form UI.
 * Keeping the mutation here keeps API concerns out of the page component.
 */
export const useContactForm = () => useMutation({ mutationFn: submitContact });
