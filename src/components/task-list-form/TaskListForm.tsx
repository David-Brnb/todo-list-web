import { useState } from "react";
import { Palette } from "lucide-react";
import { Button, ErrorModal, MultilineInput, SingleLineInput } from "@/components";
import { ColorSwatch } from "@/components/color-swatch";
import { IconSwatch } from "@/components/icon-swatch";
import { getErrorMessage } from "@/services/axios/errors";
import { colorsList } from "@/types/colors/color";
import type { IconDTO } from "@/types/icons/iconDTO";

export type TaskListFormValues = {
  name: string;
  color: string;
  description: string;
  iconId: number;
};

type Props = {
  icons: IconDTO[];
  submitText: string;
  initial?: Partial<TaskListFormValues>;
  /** Throws on failure — the form shows the error and keeps the user on the page. */
  onSubmit: (values: TaskListFormValues) => Promise<void>;
};

const HEX_RE = /^#[0-9A-Fa-f]{6}$/;
const DEFAULT_CUSTOM = "#E07A5F";

export function TaskListForm({ icons, submitText, initial, onSubmit }: Props) {
  const isPreset = initial?.color
    ? colorsList.some(
        (c) => c.color.toUpperCase() === initial.color!.toUpperCase(),
      )
    : true;

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [color, setColor] = useState(initial?.color ?? "");
  const [iconId, setIconId] = useState(initial?.iconId ?? 0);
  const [customActive, setCustomActive] = useState(!isPreset && !!initial?.color);

  const [submitting, setSubmitting] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fail = (message: string) => {
    setErrorMessage(message);
    setErrorOpen(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return fail("Please enter the list name.");
    if (!description.trim()) return fail("Please enter a description.");
    if (!color.trim()) return fail("Please select a color.");
    if (!iconId) return fail("Please select an icon.");

    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        color,
        iconId,
      });
    } catch (err) {
      fail(getErrorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const selectPreset = (hex: string) => {
    setColor(hex);
    setCustomActive(false);
  };

  const activateCustom = () => {
    setCustomActive(true);
    if (!color || colorsList.some((c) => c.color === color)) {
      setColor(DEFAULT_CUSTOM);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <SingleLineInput
          label="List Title"
          placeholder="Enter task list name"
          value={name}
          onChangeText={setName}
          maxLength={50}
          showCounter={false}
        />
        <MultilineInput
          label="Description"
          placeholder="Enter list description"
          value={description}
          onChangeText={setDescription}
          maxLength={200}
        />
      </div>

      {/* Color picker */}
      <div className="flex flex-col gap-3">
        <span className="font-inter text-sm font-semibold text-ink-secondary">
          Select Color
        </span>
        <div className="flex flex-wrap gap-3">
          {colorsList.map((c) => (
            <ColorSwatch
              key={c.id}
              color={c.color}
              label={c.name}
              selected={!customActive && color === c.color}
              onClick={() => selectPreset(c.color)}
            />
          ))}
          <ColorSwatch
            color={customActive ? color || DEFAULT_CUSTOM : "#EAEAEF"}
            label="Custom color"
            selected={customActive}
            onClick={activateCustom}
          >
            <Palette
              className="h-6 w-6"
              style={{ color: customActive ? "#FFFFFF" : "#60646C" }}
            />
          </ColorSwatch>
        </div>

        {customActive ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-surface-sunken bg-surface p-5">
            <span className="font-manrope text-sm font-bold text-ink-secondary">
              Custom Color
            </span>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={HEX_RE.test(color) ? color : DEFAULT_CUSTOM}
                onChange={(e) => setColor(e.target.value.toUpperCase())}
                aria-label="Color picker"
                className="h-14 w-20 cursor-pointer rounded-xl border border-border bg-surface"
              />
              <SingleLineInput
                label="Hex Color Code"
                placeholder="#FFFFFF"
                value={color}
                showCounter={false}
                maxLength={7}
                onChangeText={(text) => {
                  let formatted = text.toUpperCase();
                  if (formatted.length > 0 && !formatted.startsWith("#")) {
                    formatted = "#" + formatted;
                  }
                  if (formatted.length <= 7 && /^#[0-9A-F]*$/.test(formatted)) {
                    setColor(formatted);
                  }
                }}
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* Icon picker */}
      <div className="flex flex-col gap-3">
        <span className="font-inter text-sm font-semibold text-ink-secondary">
          Select Icon
        </span>
        {icons.length === 0 ? (
          <p className="font-inter text-sm text-ink-muted">Loading icons…</p>
        ) : (
          <div className="grid grid-cols-5 gap-3 sm:grid-cols-6">
            {icons.map((icon) => (
              <IconSwatch
                key={icon.id}
                icon={icon}
                selected={iconId === icon.id}
                onClick={() => setIconId(icon.id)}
              />
            ))}
          </div>
        )}
      </div>

      <Button
        text={submitText}
        bgColor="#005BBF"
        textColor="#FFFFFF"
        onClick={handleSubmit}
        loading={submitting}
      />

      <ErrorModal
        open={errorOpen}
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />
    </div>
  );
}
