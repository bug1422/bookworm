import { useOptions } from '@/components/context/useOptionsContext';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckCircleIcon, ChevronsUpDown, XCircleIcon } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { cn } from '@/lib/utils';
import SkeletonLoader from '@/components/fallback/skeletonLoader';
import { useState } from 'react';
import { addBookReview } from '@/api/book';
import { useReviewQuery } from '@/components/context/useReviewQueryContext';
import SpinningCircle from '@/components/icons/loading';
import { toast } from 'sonner';
import { toastError, toastSuccess } from '@/components/toast';
import { Textarea } from '@/components/ui/textarea';

const addReviewSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .max(120, 'Title exceeds allowed length')
    .notOneOf([''], 'Title cannot be an empty string'),
  details: Yup.string().notRequired(),
  ratingStar: Yup.number()
    .required('Rating is required')
    .min(1, 'Minimum rating is 1 star')
    .max(5, 'Maximum rating is 5 stars'),
});
const AddReviewForm = () => {
  const { ratingList, isOptionLoading } = useOptions();
  const { bookId, refetchReviews } = useReviewQuery();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: yupResolver(addReviewSchema),
    defaultValues: {
      title: '',
      details: '',
      ratingStar: null,
    },
  });
  const onSubmit = async (data) => {
    setLoading(true);
    if (bookId != null && bookId !== undefined) {
      const response = await addBookReview(
        bookId,
        data.title,
        data.details,
        data.ratingStar,
      );
      if (response.error) {
        toastError('Review failed', response.errorMessage);
      } else {
        toastSuccess(
          'Review submitted',
          'Thank you for giving out your opinion.',
        );
        refetchReviews();
        form.reset(
          {},
          { keepErrors: false, keepDirty: false, keepValues: false },
        );
      }
    }
    setLoading(false);
  };
  return (
    <FormProvider {...form}>
      <form
        className="w-full flex flex-col border-2 rounded-md divide-y-2 relative"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="text-2xl font-bold p-4">Write a review</div>
        <div className="p-4 flex flex-col gap-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add a title</FormLabel>
                <FormControl>
                  <Input type="title" id="title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Details please! Your review helps other shoppers.
                </FormLabel>
                <FormControl>
                  <Textarea
                    id="details"
                    rows={2} // Ensures the textarea has enough space for 2 lines
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ratingStar"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Select a rating star</FormLabel>
                {isOptionLoading || ratingList === null ? (
                  <SkeletonLoader width="full" />
                ) : (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value
                            ? ratingList.find(
                                (rating) => rating === field.value,
                              ) + ' Star'
                            : 'Select a rating'}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="left-0 right-0 p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>No rating selected.</CommandEmpty>
                          <CommandGroup>
                            {ratingList.map((rating, k) => (
                              <CommandItem
                                value={rating}
                                key={k}
                                onSelect={() => {
                                  form.setValue('ratingStar', rating);
                                  field.value = rating;
                                  setOpen(false);
                                }}
                              >
                                {rating}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="bg-indigo-300 py-2 m-4 text-2xl font-bold cursor-pointer"
        >
          {loading ? <SpinningCircle /> : <>Submit Review</>}
        </Button>
      </form>
    </FormProvider>
  );
};

export default AddReviewForm;
