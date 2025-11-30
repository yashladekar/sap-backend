"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
// import { Label } from "@workspace/ui/components/label";

export function FeedbackForm() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to reset the form into its initial state.
  const resetForm = () => {
    setFeedback("");
    setError(null);
    setSubmitting(false);
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error submitting feedback");
      }

      console.log("Feedback submitted:", feedback);
      setSubmitted(true);
      setFeedback("");
      setOpen(false);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Error submitting feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => {
          resetForm();
          setOpen(true);
        }}
        size={"sm"}
        className="text-xs"
      >
        Feedback
      </Button>

      <AlertDialog
        open={open}
        onOpenChange={(o) => {
          if (!o) resetForm();
          setOpen(o);
        }}
      >
        <AlertDialogContent className="dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm">
              Provide Your Feedback
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              We appreciate your feedback! Please let us know your thoughts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-10">
              <div className="col-span-4">
                <Textarea
                  id="feedback"
                  placeholder="Enter your feedback here..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="resize-none border dark:border-gray-500 text-xs placeholder:text-xs"
                />
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 mt-2 text-xs italic">{error}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCancel}
              className=" border dark:border-gray-700 text-xs"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              className="text-xs"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {submitted && (
        <div className="mt-4 text-green-500">Thank you for your feedback!</div>
      )}
    </>
  );
}
