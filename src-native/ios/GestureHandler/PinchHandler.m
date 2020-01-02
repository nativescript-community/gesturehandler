//
//  PinchHandler.m
//  GestureHandler
//
//  Created by Krzysztof Magiera on 12/10/2017.
//  Copyright © 2017 Software Mansion. All rights reserved.
//

#import "PinchHandler.h"

@implementation PinchGestureHandler

- (instancetype)initWithTag:(NSNumber *)tag
{
    if ((self = [super initWithTag:tag])) {
#if !TARGET_OS_TV
        _recognizer = [[UIPinchGestureRecognizer alloc] initWithTarget:self action:@selector(handleGesture:)];
#endif
    }
    return self;
}

#if !TARGET_OS_TV
- (NSMutableDictionary *)eventExtraData:(UIPinchGestureRecognizer *)recognizer
{
  NSMutableDictionary* result = [super eventExtraData:recognizer];
  [result setObject:@(recognizer.scale) forKey:@"scale"];
  [result setObject:SAFE_VELOCITY(recognizer.velocity) forKey:@"velocity"];
  [result setObject:[result objectForKey:@"x"] forKey:@"focalX"];
  [result setObject:[result objectForKey:@"y"] forKey:@"focalY"];
  return result;
}
#endif

@end

