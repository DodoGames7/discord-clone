import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import { Formik, FormikActions, FormikProps } from 'formik'
import { DocumentNode } from 'graphql'
import { useMutation, useQuery } from 'react-apollo-hooks'
import { useMe } from '../../../services/requireAuth'
import style from '../Auth.module.css'
import validationSchema from './validationSchema'
import { CURRENT_USER } from '../../../graphql/queries'
import FormInput from '../../../components/FormInput'
import Button from '../../../components/Button'

interface FormValues {
  email: string
  password: string
}

interface Props {
  mutation: DocumentNode
  buttonLabel: string
}

const AuthForm = ({ mutation, buttonLabel }: Props) => {
  const { data } = useQuery(CURRENT_USER)
  const onSubmit = useMutation(mutation)

  if (data.me) {
    return <Redirect push to="/" />
  }

  return (
    <div>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={(
          { email, password }: FormValues,
          { setSubmitting, setFieldError }: FormikActions<FormValues>
        ) => {
          onSubmit({
            variables: { email, password },
            refetchQueries: [{ query: CURRENT_USER }]
          }).then(
            () => setSubmitting(false),
            error => {
              setFieldError('email', error.graphQLErrors[0].message)
              setSubmitting(false)
            }
          )
        }}
        validationSchema={validationSchema}
        render={(props: FormikProps<FormValues>) => (
          <form onSubmit={props.handleSubmit}>
            <div className={style.inputWrapper}>
              <FormInput
                type="text"
                name="email"
                placeholder="example@email.com"
                formikProps={props}
                label="email"
              />
            </div>

            <div className={style.inputWrapper}>
              <FormInput
                type="password"
                name="password"
                formikProps={props}
                label="password"
              />
              {buttonLabel === 'Log in' && (
                <Link to="#" className="app-link">
                  Forgot your password?
                </Link>
              )}
            </div>


            <div className={style.buttonWrapper}>
              <Button type="submit" fullwidth={true} disabled={props.isSubmitting}>
                {buttonLabel}
              </Button>
            </div>
          </form>
        )}
      />
    </div>
  )
}

export default AuthForm
