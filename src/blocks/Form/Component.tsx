'use client'

import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Mail,
  MapPin,
  MapPinned,
  MessageSquare,
  Phone,
  ShieldCheck,
} from 'lucide-react'

import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: SerializedEditorState
  contactDetails?: {
    address?: string
    addressDescription?: string
    email?: string
    emailDescription?: string
    phone?: string
    phoneDescription?: string
    mapEmbedUrl?: string
  }
}

type SubmissionError = {
  message: string
  status?: string
}

export const FormBlock: React.FC<{ id?: string } & FormBlockType> = ({
  enableIntro,
  form: formFromProps,
  introContent,
  contactDetails,
}) => {
  const {
    id: formID,
    confirmationMessage,
    confirmationType,
    redirect,
    submitButtonLabel,
  } = formFromProps

  const formMethods = useForm({
    defaultValues: formFromProps.fields,
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<SubmissionError>()

  const router = useRouter()

  const onSubmit = useCallback(
    async (data: any) => {
      setError(undefined)
      setIsLoading(true)

      const submissionData = Object.entries(data).map(([field, value]) => ({
        field,
        value: value instanceof File ? value.name : value,
      }))

      try {
        const response = await fetch(`${getClientSideURL()}/api/form-submissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            form: formID,
            submissionData,
          }),
        })

        const result = await response.json().catch(() => ({}))

        if (!response.ok) {
          setError({
            message:
              result.errors?.[0]?.message || 'We could not submit your message. Please try again.',
            status: String(response.status),
          })
          return
        }

        setHasSubmitted(true)

        if (confirmationType === 'redirect' && redirect?.url) {
          router.push(redirect.url)
        }
      } catch {
        setError({
          message: 'A connection error occurred. Please check your internet and try again.',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [formID, confirmationType, redirect, router],
  )

  const hasContactDetails = Boolean(
    contactDetails?.address ||
    contactDetails?.email ||
    contactDetails?.phone ||
    contactDetails?.mapEmbedUrl,
  )

  return (
    <section className="relative overflow-hidden bg-background text-foreground ">
      {/* Subtle decorative brand accent */}

      <div className="container relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 xl:px-14">
        {/* Intro */}
        {enableIntro && introContent && !hasSubmitted && (
          <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
            <div className="mb-5 inline-flex items-center gap-2 border border-primary/15 bg-primary/[0.04] px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              <span className="h-2 w-2 bg-accent" />
              Get in touch
            </div>

            <div className="[&_h1]:mb-5 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-primary sm:[&_h1]:text-4xl lg:[&_h1]:text-5xl [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-primary sm:[&_h2]:text-3xl [&_p]:mx-auto [&_p]:max-w-2xl [&_p]:text-base [&_p]:leading-7 [&_p]:text-muted-foreground sm:[&_p]:text-lg sm:[&_p]:leading-8">
              <RichText data={introContent} enableGutter={false} />
            </div>
          </div>
        )}

        <div
          className={`grid min-w-0 grid-cols-1 items-start gap-8 lg:gap-12 ${
            hasContactDetails ? 'lg:grid-cols-12' : 'mx-auto max-w-3xl'
          }`}
        >
          {/* ================= CONTACT FORM ================= */}
          <div className={`min-w-0 ${hasContactDetails ? 'lg:col-span-7' : ''}`}>
            <div className="overflow-hidden border border-border bg-card shadow-sm">
              {/* Form heading */}
              <div className="border-b border-border bg-primary px-6 py-7 text-white sm:px-8 sm:py-9">
                <div className="mb-5 flex h-12 w-12 items-center justify-center border border-white/20 bg-white/10">
                  <MessageSquare className="h-5 w-5 text-accent" />
                </div>

                <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/65">
                  Let&apos;s start a conversation
                </p>

                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {hasSubmitted ? 'Thank you for reaching out' : 'Send us a message'}
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-6 text-white/75 sm:text-base">
                  {hasSubmitted
                    ? 'Your message has been submitted successfully.'
                    : 'Tell us a little about what you need. Our team will get back to you as soon as possible.'}
                </p>
              </div>

              <div className="p-5 sm:p-8 lg:p-9">
                <FormProvider {...formMethods}>
                  {/* ================= SUCCESS STATE ================= */}
                  {hasSubmitted && confirmationType === 'message' ? (
                    <div
                      role="status"
                      className="border border-green-600/20 bg-green-600/[0.04] p-6 sm:p-8"
                    >
                      <div className="mb-5 flex h-14 w-14 items-center justify-center border border-green-600/20 bg-green-600/10">
                        <CheckCircle2 className="h-7 w-7 text-green-700" />
                      </div>

                      <h3 className="text-xl font-bold text-primary">Message received</h3>

                      <div className="mt-3 text-sm leading-7 text-muted-foreground [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_p]:mb-3">
                        <RichText data={confirmationMessage} />
                      </div>
                    </div>
                  ) : !hasSubmitted ? (
                    <form
                      id={formID}
                      onSubmit={handleSubmit(onSubmit)}
                      noValidate={false}
                      className="space-y-6"
                    >
                      {/* Error feedback */}
                      {error && (
                        <div
                          role="alert"
                          className="flex gap-3 border border-destructive/25 bg-destructive/[0.05] p-4"
                        >
                          <div className="h-1.5 w-1.5 shrink-0 bg-destructive mt-2" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-destructive">
                              {error.status
                                ? `Submission failed (${error.status})`
                                : 'Unable to send your message'}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                              {error.message}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Dynamic Payload fields */}
                      <div className="grid min-w-0 grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                        {formFromProps.fields?.map((field, index) => {
                          const Field = fields?.[field.blockType as keyof typeof fields]

                          if (!Field) return null

                          return (
                            <div
                              key={(field as any).id ?? `${field.blockType}-${index}`}
                              className="min-w-0 [&:has(textarea)]:sm:col-span-2 [&:has(input[type=file])]:sm:col-span-2"
                            >
                              <Field
                                {...(field as any)}
                                {...formMethods}
                              />
                            </div>
                          )
                        })}
                      </div>

                      {/* Submission action */}
                      <div className="border-t border-border pt-6">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="group h-12 w-full justify-center gap-3 rounded-none bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-none transition-colors hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-52"
                        >
                          {isLoading ? (
                            <>
                              <LoaderCircle className="h-4 w-4 animate-spin" />
                              Sending message...
                            </>
                          ) : (
                            <>
                              {submitButtonLabel || 'Send message'}
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </>
                          )}
                        </Button>

                        <div className="mt-5 flex items-start gap-2.5 text-xs leading-5 text-muted-foreground">
                          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                          <p>
                            Your information is used to respond to your enquiry and handled with
                            care.
                          </p>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="border border-border bg-muted/30 p-6">
                      <CheckCircle2 className="mb-3 h-7 w-7 text-primary" />
                      <h3 className="font-semibold text-primary">
                        Your message has been submitted
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Thank you for contacting us.
                      </p>
                    </div>
                  )}
                </FormProvider>
              </div>
            </div>

            {/* Response-time note */}
            {!hasSubmitted && (
              <div className="mt-5 flex items-start gap-3 border-l-2 border-accent bg-muted/30 px-4 py-4">
                <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-primary">What happens next?</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    We aim to respond within 1–2 business days.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ================= CONTACT INFORMATION ================= */}
          {hasContactDetails && contactDetails && (
            <aside className="min-w-0 lg:col-span-5">
              <div className="mb-6">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-accent">
                  Contact information
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                  We&apos;re here to help.
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Have a question or need more information? Reach out using any of the contact
                  details below.
                </p>
              </div>

              <div className="divide-y divide-border border border-border bg-card">
                {/* Address */}
                {contactDetails.address && (
                  <div className="flex gap-4 p-5 transition-colors hover:bg-muted/30 sm:p-6">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-primary/15 bg-primary/[0.05]">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-primary">Visit our office</h3>

                      {contactDetails.addressDescription && (
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {contactDetails.addressDescription}
                        </p>
                      )}

                      <address className="mt-2 whitespace-pre-line text-sm font-medium leading-6 not-italic text-foreground">
                        {contactDetails.address}
                      </address>
                    </div>
                  </div>
                )}

                {/* Email */}
                {contactDetails.email && (
                  <div className="flex gap-4 p-5 transition-colors hover:bg-muted/30 sm:p-6">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-primary/15 bg-primary/[0.05]">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-primary">Email us</h3>

                      {contactDetails.emailDescription && (
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {contactDetails.emailDescription}
                        </p>
                      )}

                      <a
                        href={`mailto:${contactDetails.email}`}
                        className="mt-2 inline-flex max-w-full items-center gap-1 break-all text-sm font-semibold text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        {contactDetails.email}
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {contactDetails.phone && (
                  <div className="flex gap-4 p-5 transition-colors hover:bg-muted/30 sm:p-6">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-primary/15 bg-primary/[0.05]">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-primary">Call our team</h3>

                      {contactDetails.phoneDescription && (
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {contactDetails.phoneDescription}
                        </p>
                      )}

                      <a
                        href={`tel:${contactDetails.phone.replace(/[^\d+]/g, '')}`}
                        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        {contactDetails.phone}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* ================= MAP ================= */}
              {contactDetails.mapEmbedUrl && (
                <div className="mt-6 overflow-hidden border border-border bg-card">
                  <div className="flex items-center gap-3 border-b border-border px-5 py-4 sm:px-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary">
                      <MapPinned className="h-5 w-5 text-white" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-primary">Find our location</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Explore our location on the map.
                      </p>
                    </div>
                  </div>

                  <div className="relative h-64 w-full bg-muted sm:h-72 lg:h-80">
                    <iframe
                      title="Our office location on Google Maps"
                      src={contactDetails.mapEmbedUrl}
                      className="absolute inset-0 h-full w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>

                  <div className="flex items-start gap-2.5 border-t border-border bg-muted/20 px-5 py-4 sm:px-6">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <p className="text-xs leading-5 text-muted-foreground">
                      Use the interactive map to explore the surrounding area and plan your visit.
                    </p>
                  </div>
                </div>
              )}

              {/* Trust note */}
              <div className="mt-6 flex items-start gap-3 border border-primary/10 bg-primary/[0.035] p-5">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="text-sm font-semibold text-primary">Personal, helpful support</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Contact us directly and we&apos;ll help you find the information you need.
                  </p>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  )
}
