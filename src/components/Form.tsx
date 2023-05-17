import React, { useEffect, useReducer, useRef, useState } from "react";
import { PlusIcon } from "../AppIcons";
import { TextField } from "../formBuilderFields/TextField";
import { formField } from "../types/formTypes";
import { Link, navigate } from "raviger";
import { TextArea } from "../formBuilderFields/TextArea";
import { RadioButtonField } from "../formBuilderFields/RadioButtonField";
import { DropdownField } from "../formBuilderFields/DropdownField";
import { MultiSelectField } from "../formBuilderFields/MultiSelectField";
import { formActions, reducer } from "../reducers/formReducers";
import { fetchFormData, fetchFormFields } from "../utils/apiUtils";

// const initialFormFields: formField[] = [
//   {
//     kind: "TEXT",
//     id: 1,
//     label: "First Name",
//     fieldType: "text",
//     value: "",
//   },
//   {
//     kind: "TEXT",
//     id: 2,
//     label: "Last Name",
//     fieldType: "text",
//     value: "",
//   },
//   {
//     kind: "TEXT",
//     id: 3,
//     label: "Email",
//     fieldType: "text",
//     value: "",
//   },
//   {
//     kind: "TEXT",
//     id: 4,
//     label: "Date of birth",
//     fieldType: "date",
//     value: "",
//   },
//   {
//     kind: "TEXT",
//     id: 5,
//     label: "Phone number",
//     fieldType: "tel",
//     value: "",
//   },
// ];

const fetchForm = (formID: number, dispatch: React.Dispatch<formActions>) => {
  fetchFormData(formID).then((data) => {
    dispatch({
      type: "set_form_data",
      id: formID,
      title: data.title,
      description: data.description,
    });
  });
  fetchFormFields(formID).then((data) => {
    dispatch({
      type: "set_fields",
      fields: data.results,
    });
  });
};

export default function Form(props: { id: number }) {
  const [fieldState, dispatch] = useReducer(reducer, {
    id: props.id,
    title: "",
    formFields: [],
  });
  const [newLabel, setNewLabel] = useState("");
  const [newKind, setNewKind] = useState<formField["kind"]>("TEXT");
  const [error, setError] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fieldState.id !== props.id && navigate(`/form/${fieldState.id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldState.id]);

  useEffect(() => {
    fetchForm(props.id, dispatch);
    titleRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   let timeout = setTimeout(() => {
  //     saveFormData(fieldState);
  //     console.log("Saved to local storage");
  //   }, 500);
  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, [fieldState]);

  return (
    <div className="flex flex-col gap-4 divide-y">
      <div>
        <div className="flex mt-2">
          <span className="inline-flex items-center px-3 text-md font-semibold border border-r-0 rounded-l-md bg-gray-300 text-gray-700 border-gray-600">
            Form title
          </span>
          <input
            type="text"
            id="form-title"
            ref={titleRef}
            value={fieldState.title}
            onChange={(event) =>
              dispatch({ type: "update_title", title: event.target.value })
            }
            className="rounded-none border block flex-1 min-w-0 w-full text-sm p-2.5 rounded-r-md bg-gray-100 border-gray-600 placeholder-gray-400 text-gray-700 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Form title"
          />
        </div>
        <div className="flex flex-col mt-2">
          <span className="inline-flex items-center px-3 text-md font-semibold border border-b-0 rounded-t-md bg-gray-300 text-gray-700 border-gray-600">
            Description
          </span>
          <textarea
            name="description"
            id="description"
            value={fieldState.description}
            onChange={(event) =>
              dispatch({
                type: "update_form_description",
                description: event.target.value,
              })
            }
            className="rounded-none border block flex-1 min-w-0 w-full text-sm p-2.5 rounded-b-md bg-gray-100 border-gray-600 placeholder-gray-400 text-gray-700 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      {fieldState.formFields && (
        <div>
          {fieldState.formFields.length > 0 ? (
            <div className="flex flex-col">
              {
                // eslint-disable-next-line array-callback-return
                fieldState.formFields.map((field) => {
                  switch (field.kind) {
                    case "TEXT":
                      return (
                        <div className="my-1" key={field.id}>
                          <h3 className="text-md font-semibold">Text Field</h3>
                          {field.label === "" && (
                            <div className="bg-red-200 my-2 border border-red-600 px-2 rounded-md text-red-600">
                              Label cannot be empty.
                            </div>
                          )}
                          <TextField
                            key={field.id}
                            id={field.id}
                            label={field.label}
                            fieldType={field.fieldType}
                            value={field.value}
                            placeholder="Enter label for Text Field"
                            updateLabelCB={(id, label) => {
                              dispatch({
                                type: "update_label",
                                id: id,
                                label: label,
                              });
                            }}
                            updateTextTypeCB={(id, fieldType) => {
                              dispatch({
                                type: "update_text_type",
                                id: id,
                                fieldType: fieldType,
                              });
                            }}
                            removeFieldCB={(id) =>
                              dispatch({
                                type: "remove_field",
                                id: id,
                              })
                            }
                          />
                        </div>
                      );
                    case "TEXTAREA":
                      return (
                        <div className="my-1" key={field.id}>
                          <h3 className="text-md font-semibold">Text Area</h3>
                          {field.label === "" && (
                            <div className="bg-red-200 my-2 border border-red-600 px-2 rounded-md text-red-600">
                              Label cannot be empty.
                            </div>
                          )}
                          <TextArea
                            key={field.id}
                            id={field.id}
                            label={field.label}
                            placeholder={"Enter label for Text area"}
                            value={field.value}
                            updateLabelCB={(id, label) => {
                              dispatch({
                                type: "update_label",
                                id: id,
                                label: label,
                              });
                            }}
                            removeFieldCB={(id) =>
                              dispatch({
                                type: "remove_field",
                                id: id,
                              })
                            }
                          />
                        </div>
                      );
                    case "DROPDOWN":
                      return (
                        <div className="my-1" key={field.id}>
                          <h3 className="text-md font-semibold">Dropdown</h3>
                          {field.label === "" && (
                            <div className="bg-red-200 my-2 border border-red-600 px-2 rounded-md text-red-600">
                              Label cannot be empty.
                            </div>
                          )}
                          <DropdownField
                            id={field.id}
                            label={field.label}
                            placeholder="Enter label for Dropdown"
                            value={field.value}
                            options={field.options}
                            updateOptionsCB={(id, options) => {
                              dispatch({
                                type: "update_options",
                                id: id,
                                options: options,
                              });
                            }}
                            updateLabelCB={(id, label) => {
                              dispatch({
                                type: "update_label",
                                id: id,
                                label: label,
                              });
                            }}
                            removeFieldCB={(id) =>
                              dispatch({
                                type: "remove_field",
                                id: id,
                              })
                            }
                          />
                        </div>
                      );
                    case "MULTISELECT":
                      return (
                        <div className="my-1" key={field.id}>
                          <h3 className="text-md font-semibold">Multiselect</h3>
                          {field.label === "" && (
                            <div className="bg-red-200 my-2 border border-red-600 px-2 rounded-md text-red-600">
                              Label cannot be empty.
                            </div>
                          )}
                          <MultiSelectField
                            id={field.id}
                            label={field.label}
                            placeholder="Enter label for Dropdown"
                            value={field.value}
                            options={field.options}
                            updateOptionsCB={(id, options) => {
                              dispatch({
                                type: "update_options",
                                id: id,
                                options: options,
                              });
                            }}
                            updateLabelCB={(id, label) => {
                              dispatch({
                                type: "update_label",
                                id: id,
                                label: label,
                              });
                            }}
                            removeFieldCB={(id) =>
                              dispatch({
                                type: "remove_field",
                                id: id,
                              })
                            }
                          />
                        </div>
                      );
                    case "RADIO":
                      return (
                        <div className="my-1" key={field.id}>
                          <h3 className="text-md font-semibold">
                            Radio button
                          </h3>
                          {field.label === "" && (
                            <div className="bg-red-200 my-2 border border-red-600 px-2 rounded-md text-red-600">
                              Label cannot be empty.
                            </div>
                          )}
                          <RadioButtonField
                            id={field.id}
                            label={field.label}
                            placeholder="Enter label for Radio button"
                            value={field.value}
                            options={field.options}
                            updateOptionsCB={(id, options) => {
                              dispatch({
                                type: "update_options",
                                id: id,
                                options: options,
                              });
                            }}
                            updateLabelCB={(id, label) => {
                              dispatch({
                                type: "update_label",
                                id: id,
                                label: label,
                              });
                            }}
                            removeFieldCB={(id) =>
                              dispatch({
                                type: "remove_field",
                                id: id,
                              })
                            }
                          />
                        </div>
                      );
                  }
                })
              }
            </div>
          ) : (
            <div>
              <h4 className="font-semibold text-xl my-1">
                There are no fields currently
              </h4>
              <p>You can start adding fields below</p>
            </div>
          )}
        </div>
      )}
      <div className="w-full pt-2">
        <label
          htmlFor="add-field"
          className="block mb-1 text-sm font-medium text-gray-700 w-full"
        >
          Add field
        </label>
        {error && (
          <div className="bg-red-200 border border-red-600 px-2 rounded-md text-red-600">
            {error}
          </div>
        )}
        <div className="flex mt-1 w-full">
          <select
            value={newKind}
            onChange={(event) => {
              setNewKind(event.target.value as formField["kind"]);
            }}
            className="items-center px-3 text-sm border border-r-0 rounded-l-md bg-gray-300 text-gray-700 border-gray-600"
          >
            <option className="w-full bg-gray-300" value="TEXT">
              Text Field
            </option>
            <option className="w-full bg-gray-300" value="TEXTAREA">
              Text Area
            </option>
            <option className="w-full bg-gray-300" value="RADIO">
              Radio button
            </option>
            <option className="w-full bg-gray-300" value="DROPDOWN">
              Dropdown
            </option>
            <option className="w-full bg-gray-300" value="MULTISELECT">
              Multi-Select
            </option>
          </select>
          <input
            type="text"
            id="add-field"
            value={newLabel}
            onChange={(event) => setNewLabel(event.target.value)}
            className="rounded-none border block flex-1 min-w-0 w-full text-sm p-2.5 bg-gray-100 border-gray-600 placeholder-gray-400 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Field name"
          />
          <button
            onClick={(_) => {
              if (newLabel === "") {
                return setError("Label cannot be empty");
              }
              setError("");
              setNewKind("TEXT");
              setNewLabel("");
              return dispatch({
                type: "add_field",
                label: newLabel,
                kind: newKind,
              });
            }}
            className="inline-flex items-center px-3 text-sm border border-l-0 rounded-r-md bg-gray-300 text-gray-700 border-gray-600"
          >
            <PlusIcon className={"w-5 h-5"} />
            <span className="ml-2 font-semibold">Add field</span>
          </button>
        </div>
      </div>
      <div className="flex gap-4 mt-2">
        <Link
          href="/"
          className="text-center bg-gray-300 py-2 w-full rounded-lg mt-3 border font-semibold transition-all border-gray-700 text-gray-7s00"
        >
          Close Form
        </Link>
      </div>
    </div>
  );
}
