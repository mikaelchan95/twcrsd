import { supabase } from '../../lib/supabase/client';
import type { SalesData } from '../../types/sales';
import { validateSalesData } from '../../utils/validation';

export async function getAllSalesData(): Promise<SalesData[]> {
  const { data: salesData, error: salesError } = await supabase
    .from('sales_data')
    .select(`
      *,
      payment_methods (
        method,
        amount
      ),
      promotions (
        name,
        amount,
        sets
      )
    `)
    .order('date');

  if (salesError) {
    console.error('Error fetching sales data:', salesError);
    throw new Error('Failed to fetch sales data');
  }

  // Transform and validate the data
  const transformedData = salesData.map(record => ({
    date: record.date,
    totalSales: record.total_sales,
    foodSales: record.food_sales,
    barSales: record.bar_sales,
    wineSales: record.wine_sales,
    happyHourSales: record.happy_hour_sales,
    salesFrom7pmTo10pm: record.sales_7pm_to_10pm,
    after10pmSales: record.after_10pm_sales,
    totalPax: record.total_pax,
    reservations: record.reservations,
    walkIns: record.walk_ins,
    noShows: record.no_shows,
    cancellations: record.cancellations,
    phoneCallsAnswered: record.phone_calls_answered,
    missedPhoneCalls: record.missed_phone_calls,
    perHeadSpend: record.per_head_spend,
    paymentMethods: record.payment_methods.reduce((acc, pm) => ({
      ...acc,
      [pm.method]: pm.amount
    }), {}),
    promotions: record.promotions.map(p => ({
      name: p.name,
      amount: p.amount,
      sets: p.sets
    }))
  }));

  return validateSalesData(transformedData);
}

export async function addSalesData(data: SalesData[]): Promise<void> {
  const { error: salesError } = await supabase.from('sales_data').insert(
    data.map(record => ({
      date: record.date,
      total_sales: record.totalSales,
      food_sales: record.foodSales,
      bar_sales: record.barSales,
      wine_sales: record.wineSales,
      happy_hour_sales: record.happyHourSales,
      sales_7pm_to_10pm: record.salesFrom7pmTo10pm,
      after_10pm_sales: record.after10pmSales,
      total_pax: record.totalPax,
      reservations: record.reservations,
      walk_ins: record.walkIns,
      no_shows: record.noShows,
      cancellations: record.cancellations,
      phone_calls_answered: record.phoneCallsAnswered,
      missed_phone_calls: record.missedPhoneCalls,
      per_head_spend: record.perHeadSpend
    }))
  );

  if (salesError) {
    console.error('Error adding sales data:', salesError);
    throw new Error('Failed to add sales data');
  }

  // Add payment methods and promotions
  for (const record of data) {
    const { data: salesRecord } = await supabase
      .from('sales_data')
      .select('id')
      .eq('date', record.date)
      .single();

    if (salesRecord) {
      // Add payment methods
      const { error: pmError } = await supabase.from('payment_methods').insert(
        Object.entries(record.paymentMethods).map(([method, amount]) => ({
          sales_data_id: salesRecord.id,
          method,
          amount
        }))
      );

      if (pmError) {
        console.error('Error adding payment methods:', pmError);
        throw new Error('Failed to add payment methods');
      }

      // Add promotions
      if (record.promotions.length > 0) {
        const { error: promoError } = await supabase.from('promotions').insert(
          record.promotions.map(promo => ({
            sales_data_id: salesRecord.id,
            name: promo.name,
            amount: promo.amount,
            sets: promo.sets
          }))
        );

        if (promoError) {
          console.error('Error adding promotions:', promoError);
          throw new Error('Failed to add promotions');
        }
      }
    }
  }
}

export async function updateSalesData(data: SalesData[]): Promise<void> {
  for (const record of data) {
    const { error: salesError } = await supabase
      .from('sales_data')
      .update({
        total_sales: record.totalSales,
        food_sales: record.foodSales,
        bar_sales: record.barSales,
        wine_sales: record.wineSales,
        happy_hour_sales: record.happyHourSales,
        sales_7pm_to_10pm: record.salesFrom7pmTo10pm,
        after_10pm_sales: record.after10pmSales,
        total_pax: record.totalPax,
        reservations: record.reservations,
        walk_ins: record.walkIns,
        no_shows: record.noShows,
        cancellations: record.cancellations,
        phone_calls_answered: record.phoneCallsAnswered,
        missed_phone_calls: record.missedPhoneCalls,
        per_head_spend: record.perHeadSpend
      })
      .eq('date', record.date);

    if (salesError) {
      console.error('Error updating sales data:', salesError);
      throw new Error('Failed to update sales data');
    }

    // Get the sales_data_id
    const { data: salesRecord } = await supabase
      .from('sales_data')
      .select('id')
      .eq('date', record.date)
      .single();

    if (salesRecord) {
      // Update payment methods
      await supabase
        .from('payment_methods')
        .delete()
        .eq('sales_data_id', salesRecord.id);

      const { error: pmError } = await supabase.from('payment_methods').insert(
        Object.entries(record.paymentMethods).map(([method, amount]) => ({
          sales_data_id: salesRecord.id,
          method,
          amount
        }))
      );

      if (pmError) {
        console.error('Error updating payment methods:', pmError);
        throw new Error('Failed to update payment methods');
      }

      // Update promotions
      await supabase
        .from('promotions')
        .delete()
        .eq('sales_data_id', salesRecord.id);

      if (record.promotions.length > 0) {
        const { error: promoError } = await supabase.from('promotions').insert(
          record.promotions.map(promo => ({
            sales_data_id: salesRecord.id,
            name: promo.name,
            amount: promo.amount,
            sets: promo.sets
          }))
        );

        if (promoError) {
          console.error('Error updating promotions:', promoError);
          throw new Error('Failed to update promotions');
        }
      }
    }
  }
}

export async function clearSalesData(): Promise<void> {
  const { error } = await supabase.from('sales_data').delete().neq('id', '');
  
  if (error) {
    console.error('Error clearing sales data:', error);
    throw new Error('Failed to clear sales data');
  }
}