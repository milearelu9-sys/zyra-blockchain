// Add dependencies in Cargo.toml:
// tokio = { version = "1", features = ["full"] }
// futures = "0.3"
// rand = "0.8"

use tokio::task;
use futures::future::join_all;
use std::time::{Instant};
use rand::Rng;

/// Simulate a realistic transaction processing, including random delays and possible failures.
async fn process_batch(batch: Vec<u32>) {
    let mut rng = rand::thread_rng();
    for tx_id in batch {
        // Simulate variable processing time (30-120 microseconds)
        let delay = rng.gen_range(30..=120);
        tokio::time::sleep(tokio::time::Duration::from_micros(delay)).await;

        // Simulate random failure (e.g., 0.1% fail rate)
        if rng.gen_bool(0.001) {
            eprintln!("Transaction {} failed to process.", tx_id);
        }
    }
}

#[tokio::main]
async fn main() {
    let total_txs = 100_000; // total transactions to simulate
    let batch_size = 1_000;  // txs per batch
    let concurrency = 50;    // number of parallel workers

    let start = Instant::now();

    // Split transactions into batches
    let batches: Vec<Vec<u32>> = (0..total_txs)
        .collect::<Vec<_>>()
        .chunks(batch_size)
        .map(|chunk| chunk.to_vec())
        .collect();

    let mut handles = vec![];
    let mut processed = 0;

    for (i, batch) in batches.into_iter().enumerate() {
        let handle = task::spawn(process_batch(batch));
        handles.push(handle);

        if handles.len() >= concurrency {
            let _ = join_all(handles).await;
            handles = vec![];
            processed += batch_size * concurrency;
            if processed % 10_000 == 0 {
                println!("Progress: {} transactions processed...", processed);
            }
        }
    }

    if !handles.is_empty() {
        let _ = join_all(handles).await;
    }

    let duration = start.elapsed();
    let tps = total_txs as f64 / duration.as_secs_f64();

    println!("Processed {} transactions in {:.2?} -> TPS: {:.2}", total_txs, duration, tps);
}